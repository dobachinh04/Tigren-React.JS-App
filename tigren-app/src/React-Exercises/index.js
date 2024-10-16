import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import HelloWorld from './App';
import Login from './components/Login';
import TestimonialList from './components/TestimonialList';
import ProductList from './components/ProductList';
import {
    UserGreeting,
    Counter,
    ToggleButton,
    NameForm,
    NameList,
    SearchableNameList,
    SimpleClock,
    TodoList
} from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/*<HelloWorld />*/}
        {/*<UserGreeting name="Đỗ Bá Chính" />*/}
        {/*<Counter />*/}
        {/*<ToggleButton />*/}
        {/*<NameForm />*/}
        {/*<NameList />*/}
        {/*<SearchableNameList />*/}
        {/*<SimpleClock />*/}
        {/*<TodoList />*/}
        <Login />
        <TestimonialList />
        <ProductList />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
