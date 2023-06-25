import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [filter, setFilter] = useState("title");

  const [order, setOrder] = useState("asc");

  const [searchValue, setSearchValue] = useState("");

  const [column, setColumn] = useState("");

  const [title, setTitle] = useState("");

  const [type, setType] = useState("");

  const [description, setDescription] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  const getTasks = async (params = {}) => {
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    console.log(queryParams);
    const response = await fetch(
      `http://localhost:8080/tasks?${queryParams}&page=${currentPage}`,
      {
        method: "GET",
      }
    );

    const { content: tasks, totalPages, size } = await response.json();

    setTasks(tasks);
    setTotalPages(totalPages);
    setPageSize(size);
  };

  console.log(currentPage);

  const addTask = async (newTitle, newType, newDesc) => {
    await fetch(`http://localhost:8080/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        type: newType,
        description: newDesc,
      }),
    });
    await getTasks({
      [filter]: searchValue,
      sort: `${column},${order}`,
      page: currentPage,
      size: 10,
    });
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    // Validation
    if (type === "") {
      alert("Please select a type");
      return;
    }

    if (title === "") {
      alert("Please insert title");
      return;
    }

    if (description === "") {
      alert("Please insert description");
      return;
    }

    if (title.length > 255 || description.length > 255) {
      alert("Title and description must not exceed 255 characters");
      return;
    }

    await addTask(title, type, description);

    // clear fields
    setTitle("");
    setType("");
    setDescription("");
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8080/tasks/${id}`, { method: "DELETE" });
      await getTasks({
        [filter]: searchValue,
        sort: `${column},${order}`,
        page: currentPage,
        size: 10,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTasks({
      [filter]: searchValue,
      sort: `${column},${order}`,
      page: currentPage,
      size: 10,
    });
  }, [currentPage]);

  const handleChange = (e) => {
    if (e.target.value === "type") {
      setSearchValue("SHOPPING");
    } else {
      setSearchValue("");
    }
    setFilter(e.target.value);
  };

  const handleSubmit = (e) => {
    setCurrentPage(0);

    e.preventDefault();

    getTasks({
      [filter]: searchValue,
      sort: `${column},${order}`,
      page: currentPage,
      size: 10,
    });
  };

  const handleEdit = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleTaskChange = (taskId, field, value) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, [field]: value };
        }
        return task;
      });
    });
  };

  const handleConfirm = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      try {
        await fetch(`http://localhost:8080/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taskToUpdate.title,
            type: taskToUpdate.type,
            description: taskToUpdate.description,
            done: taskToUpdate.done,
          }),
        });

        setEditingTaskId(null);
        await getTasks({
          [filter]: searchValue,
          sort: `${column},${order}`,
          page: currentPage,
          size: 10,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const sortColumn = async (name) => {
    let sortOrder;
    setColumn(name);
    if (column === name) {
      sortOrder = order === "asc" ? "desc" : "asc";
    } else {
      sortOrder = "desc";
    }

    getTasks({
      [filter]: searchValue,
      sort: `${column},${order}`,
      page: currentPage,
      size: 10,
    });

    setOrder(sortOrder);
    setTasks(tasks);
  };

  return (
    <section className="task-section">
      <form onSubmit={handleAdd} className="task-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="task-input"
          />
        </label>

        <label>
          Type:
          <select
            onChange={handleTypeChange}
            value={type}
            className="task-input"
          >
            <option value="">Select Type</option>
            <option value="SHOPPING">shopping</option>
            <option value="WORK">work</option>
            <option value="STUDY">study</option>
            <option value="FAMILY">family</option>
          </select>
        </label>

        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            className="task-input"
          />
        </label>

        <button type="submit">Add Task</button>
      </form>

      <form onSubmit={handleSubmit}>
        {filter === "type" ? (
          <select
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          >
            <option value={"SHOPPING"}>shopping</option>
            <option value={"WORK"}>work</option>
            <option value={"STUDY"}>study</option>
            <option value={"FAMILY"}>family</option>
          </select>
        ) : (
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        )}
        <select onChange={handleChange} value={filter}>
          <option value={"title"}>Title</option>
          <option value={"type"}>Type</option>
        </select>

        <button>Filter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th onClick={() => sortColumn("title")}>Title</th>
            <th onClick={() => sortColumn("type")}>Type</th>
            <th onClick={() => sortColumn("description")}>Description</th>
            <th onClick={() => sortColumn("done")}>Done</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              {editingTaskId === task.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        handleTaskChange(task.id, "title", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={task.type}
                      onChange={(e) =>
                        handleTaskChange(task.id, "type", e.target.value)
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="SHOPPING">shopping</option>
                      <option value="WORK">work</option>
                      <option value="STUDY">study</option>
                      <option value="FAMILY">family</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) =>
                        handleTaskChange(task.id, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(e) =>
                        handleTaskChange(task.id, "done", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleConfirm(task.id)}>
                      Confirm
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{task.title}</td>
                  <td>{task.type}</td>
                  <td>{task.description}</td>
                  <td>
                    <input type="checkbox" checked={task.done} disabled />
                  </td>
                  <td>
                    <button onClick={() => handleEdit(task.id)}>Edit</button>
                  </td>
                  <td>
                    <button type="button" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {currentPage !== 0 && totalPages !== 1 && (
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
      )}

      {currentPage !== totalPages - 1 && (
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      )}
    </section>
  );
}

export default App;
