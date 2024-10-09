import React, { useState, useEffect } from "react";
import "./App.css";
// Ex 1: Hello World Component
// Xuất theo default
function HelloWorld() {
  return (
    <div>
      <h1>Ex 1: Hello, World!</h1>
    </div>
  );
}
export default HelloWorld; // Xuất mặc định

// Ex 2: Hiển thị Props
// Xuất theo name
export function UserGreeting(props) {
  return (
    <div>
      <hr />
      <h1>Ex 2: Hello, {props.name}!</h1>
    </div>
  );
}

// Ex 3: Counter component
export function Counter() {
  // Sử dụng useState để tạo một state cho bộ đếm
  const [count, setCount] = useState(0);

  // Hàm xử lý khi nhấn nút
  const handleIncrement = () => {
    setCount(count + 1); // Tăng giá trị bộ đếm
  };

  return (
    <div>
      <hr />
      <h1>Ex 3: Bộ Đếm: {count}</h1>
      <button onClick={handleIncrement}>Tăng Lên</button>
    </div>
  );
}

// Ex 4: Toggle Component
export function ToggleButton() {
  // Sử dụng useState để tạo state cho trạng thái bật/tắt
  const [isOn, setIsOn] = useState(false);

  // Hàm xử lý khi nhấn nút để đổi trạng thái
  const handleToggle = () => {
    setIsOn(!isOn); // Đảo ngược trạng thái giữa true và false
  };

  return (
    <div>
      <hr />
      {/* Hiển thị "ON" hoặc "OFF" */}
      <h1>{isOn ? "Ex 4: ON" : "Ex 4: OFF"}</h1>

      {/* Nút nhấn  */}
      <button onClick={handleToggle}>On/Off</button>
    </div>
  );
}

// Ex 5: Form Handling
export function NameForm() {
  const [name, setName] = useState(""); // Lưu trữ giá trị của input
  const [submittedName, setSubmittedName] = useState(""); // Lưu trữ tên khi submit

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form reload lại trang
    setSubmittedName(name); // Đặt tên đã nhập vào state submittedName
  };

  return (
    <div>
      <hr />
      <form onSubmit={handleSubmit}>
        <h1>Ex 5:</h1>
        <input
          type="text"
          value={name} // Giá trị của input được liên kết với state 'name'
          onChange={(e) => setName(e.target.value)} // Cập nhật giá trị 'name' khi người dùng nhập
          placeholder="Nhập tên của bạn"
        />
        <button type="submit">Submit</button>
      </form>
      {/* Hiển thị tên đã nhập sau khi submit */}
      {submittedName && <h2>Tên của bạn là: {submittedName}</h2>}
    </div>
  );
}

// Ex 6: Danh sách (List)
export function NameList() {
  // Tạo một mảng chứa các tên
  const names = ["Chính", "Khánh", "Tuấn", "Nhật", "Anh Khuê"];

  return (
    <div>
      <hr />
      <h1>Ex 6: Danh sách tên:</h1>
      <ul>
        {/* Sử dụng phương thức map để render danh sách các tên */}
        {names.map((name, index) => (
          <li key={index}>{name}</li> // Hiển thị từng tên
        ))}
      </ul>
    </div>
  );
}

// Ex 7: Tìm kiếm trong danh sách
export function SearchableNameList() {
  // Tạo một mảng chứa các tên
  const names = ["Chính", "Khánh", "Tuấn", "Nhật", "Anh Khuê"];

  // State để lưu trữ từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách dựa trên từ khóa
  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <hr />
      <h1>Ex 7: Tìm kiếm tên:</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
        placeholder="Nhập tên để tìm kiếm"
      />
      <ul>
        {/* Hiển thị danh sách tên đã lọc */}
        {filteredNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

// Ex 8: Đồng hồ đơn giản (Simple Clock)
export function SimpleClock() {
  // State để lưu trữ thời gian hiện tại
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sử dụng useEffect để thiết lập interval cập nhật thời gian mỗi giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // Cập nhật thời gian hiện tại
    }, 1000); // 1000 ms = 1 giây

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []); // Chỉ chạy một lần khi component mount

  // Định dạng thời gian thành chuỗi
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div>
      <hr />
      <h1>Ex 8: Đồng Hồ Đơn Giản</h1>
      <h1>{formattedTime}</h1> {/* Hiển thị thời gian */}
    </div>
  );
}

// Ex 9: Todo List
export function TodoList() {
  // State để lưu trữ danh sách các công việc
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState(""); // State cho input công việc mới

  // Hàm thêm công việc vào danh sách
  const handleAddTodo = (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang
    if (inputValue.trim()) {
      // Kiểm tra xem input không rỗng
      setTodos([...todos, inputValue]); // Thêm công việc vào danh sách
      setInputValue(""); // Xóa input sau khi thêm
    }
  };

  // Hàm xóa công việc
  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index); // Lọc ra công việc không phải là công việc cần xóa
    setTodos(newTodos); // Cập nhật lại danh sách công việc
  };

  return (
    <div>
      <hr />
      <h1>Ex 9: Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={inputValue} // Liên kết giá trị input với state
          onChange={(e) => setInputValue(e.target.value)} // Cập nhật state khi người dùng nhập
          placeholder="Nhập công việc của bạn"
        />
        <button type="submit">Thêm</button>
      </form>
      <ul>
        {/* Hiển thị danh sách công việc */}
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
              }}
              onClick={() => handleDeleteTodo(index)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
