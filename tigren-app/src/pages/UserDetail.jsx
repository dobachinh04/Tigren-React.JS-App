import React from 'react';
import '../styles/UserDetail.css'; // Đảm bảo bạn đã tạo file này

const UserDetail = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    return (
        <div className="user-detail-container">
            <h2>User Detail</h2>
            {userData ? (
                <div className="user-detail">
                    <p><strong>First Name:</strong> {userData.firstname}</p>
                    <p><strong>Last Name:</strong> {userData.lastname}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default UserDetail;
