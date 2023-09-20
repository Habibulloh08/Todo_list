import { useReducer } from "react";
import "./App.css";
import { Button, Input, message } from "antd";
function App() {
  const globalFunc = (state, action) => {
    switch (action.type) {
      case "GET_INPUT_VALUE":
        return {
          ...state,
          inpValue: action.val,
        };
      case "ADD_TODO":
        return {
          inpValue: "",
          list: [{ title: state.inpValue, id: Date.now() }, ...state.list],
        };
      case "DELETE_TODO":
        return {
          ...state,
          list: state.list.filter((todo) => todo.id !== action.payloadId),
        };
      case "EDIT_TODO":
        return {
          ...state,
          selectedID: action.payloadId,
          editedVal: action.editVal,
        };
      case "GET_EDIT_INPUT_VALUE":
        return {
          ...state,
          editedVal: action.val,
        };
      case "SAVE_TODO":
        return {
          ...state,
          selectedID: null,
          list: state.list.map((todo) =>
            todo.id === action.payloadId
              ? { ...todo, title: action.editVal }
              : todo
          ),
        };
      case "CHEK_ITEM":
        return {
          ...state,
          list: state.list.map((todo) =>
            todo.id === action.payloadId
              ? { ...todo, isDone: !todo.isDone }
              : todo
          ),
        };
    }
  };
  const [state, dispatch] = useReducer(globalFunc, {
    inpValue: "",
    list: [],
    selectedID: "",
    editedVal: "",
  });

  return (
    <div className="w-full mx-auto max-w-[700px]">
      <div className="flex flex-col bg-slate-100 p-4 rounded-md mt-5">
        <div className="w-ful flex items-center gap-2">
          <input
            value={state.inpValue}
            onChange={(e) =>
              dispatch({ type: "GET_INPUT_VALUE", val: e.target.value })
            }
            type="text"
            className="border rounded-md p-2 w-full"
            placeholder="Enter todo title"
          />
          <Button
            disabled={state.inpValue === ""}
            onClick={() => dispatch({ type: "ADD_TODO" })}
            className="border px-5 py-1 rounded-md"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-col my-3 mt-5">
          {state.list.length > 0
            ? state.list.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start justify-between bg-slate-300 p-2 rounded-md my-2"
                >
                  <div className="w-full mr-5">
                    {state.selectedID === todo.id ? (
                      <Input
                        onChange={(e) =>
                          dispatch({
                            type: "GET_EDIT_INPUT_VALUE",
                            val: e.target.value,
                          })
                        }
                        type="text"
                        defaultValue={todo.title}
                        className="w-full"
                      />
                    ) : (
                      <h1
                        className={`text-[22px] font-bold ${
                          todo.isDone ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.title}
                      </h1>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() =>
                        dispatch({ type: "CHEK_ITEM", payloadId: todo.id })
                      }
                    />
                    <Button
                      onClick={() => {
                        dispatch({ type: "DELETE_TODO", payloadId: todo.id });
                        message.success(`Todo ${todo.title} deleted seccess`);
                      }}
                      danger
                    >
                      Delete
                    </Button>
                    {state.selectedID === todo.id ? (
                      <button
                        onClick={() => {
                          dispatch({
                            type: "SAVE_TODO",
                            payloadId: todo.id,
                            editVal: state.editedVal,
                          });
                          state.editedVal.length < 1 &&
                            dispatch({
                              type: "SAVE_TODO",
                              payloadId: todo.id,
                              editVal: todo.title,
                            });
                        }}
                        className="border p-1 rounded-md border-green-700 hover:bg-green-700 hover:text-white"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          dispatch({
                            type: "EDIT_TODO",
                            payloadId: todo.id,
                            editVal: todo.title,
                          })
                        }
                        className="border p-1 rounded-md border-green-700 hover:bg-green-700 hover:text-white"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))
            : "No todos"}
        </div>
      </div>
    </div>
  );
}

export default App;
