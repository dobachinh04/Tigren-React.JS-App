// UserDetail.jsx
import React from 'react';

const UserDetail = () => {
    // Bạn có thể lấy dữ liệu người dùng từ localStorage hoặc context API nếu cần
    const userData = JSON.parse(localStorage.getItem('userData'));

    return (
        <div>
            <h2>User Detail</h2>
            {userData ? (
                <div>
                    <p>First Name: {userData.firstname}</p>
                    <p>Last Name: {userData.lastname}</p>
                    <p>Email: {userData.email}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default UserDetail;
