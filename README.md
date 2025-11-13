# Hướng Dẫn Cài Đặt Backend

## Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

-   **Node.js** (phiên bản 14 trở lên) và **npm** (đi kèm với Node.js).
-   **MySQL** (phiên bản 5.7 trở lên) để lưu trữ cơ sở dữ liệu.
-   **Git** để pull code từ repository.

Nếu chưa có, bạn có thể tải về từ:

-   [Node.js](https://nodejs.org/)
-   [MySQL](https://www.mysql.com/)

## Các Bước Cài Đặt

Hãy làm theo từng bước dưới đây để thiết lập backend.

### 1. Pull Code Về Máy

Clone repository từ GitHub về máy tính của bạn:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

_(Thay `https://github.com/your-username/your-repo.git` bằng URL repository thực tế của bạn.)_

### 2. Tạo Database Trên MySQL

-   Mở MySQL Workbench hoặc sử dụng Laragon, Xampp, Wamp để kết nối với MySQL.
-   Tạo một database mới (chỉ cần tạo database, không cần tạo table lúc này):

```sql
CREATE DATABASE your_database_name;
```

_(Thay `your_database_name` bằng tên database bạn muốn, ví dụ: `hospital_db`.)_

### 3. Cấu Hình Thông Tin Database

-   Mở file `backend/src/config/config.json`.
-   Chỉnh sửa phần `development` (hoặc môi trường tương ứng) với thông tin database của bạn:

```json
{
    "development": {
        "username": "your_mysql_username", // Ví dụ: root
        "password": "your_mysql_password",
        "database": "your_database_name", // Tên database bạn vừa tạo
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
```

### 4. Tạo File .env

-   Trong thư mục `backend`, tạo một file mới tên `.env`.
-   Sao chép nội dung từ file `.env.example` (nếu có) vào `.env`.
-   Điền thông tin cần thiết vào `.env`, ví dụ:

```
JWT_SECRET=your_jwt_secret_key  // Khóa bí mật cho JWT
DB_HOST=127.0.0.1
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=your_database_name
PORT=3000  // Cổng server chạy
```

_(Đảm bảo không commit file `.env` lên GitHub để tránh lộ thông tin nhạy cảm.)_

### 5. Cài Đặt Các Package

-   Mở terminal và di chuyển vào thư mục `backend`:

```bash
cd backend
```

-   Chạy lệnh để cài đặt tất cả các package cần thiết:

```bash
npm install
```

### 6. Migrate Database (Tạo Các Table)

-   Chạy lệnh để tạo các table trong database dựa trên models Sequelize:

```bash
npx sequelize-cli db:migrate
```

_(Nếu gặp lỗi, kiểm tra lại kết nối database trong `config.json`.)_

### 7. Seed Data (Tạo Dữ Liệu Mẫu)

-   Chạy lệnh để insert dữ liệu mẫu vào các table:

```bash
npx sequelize-cli db:seed:all
```

_(Dữ liệu mẫu sẽ giúp bạn test hệ thống nhanh chóng.)_

### 8. Chạy Server

-   Khởi động server ở chế độ development:

```bash
npm run dev
```

-   Server sẽ chạy tại `http://localhost:PORT` (cổng bạn cấu hình trong `.env`).
-   Kiểm tra bằng cách truy cập một endpoint công khai, ví dụ: `http://localhost:PORT/api/service`.

## Lưu Ý Thêm

-   **Môi Trường Production**: Để chạy ở production, sử dụng `npm start`. Đảm bảo cấu hình `config.json` cho môi trường `production`.
-   **Lỗi Thường Gặp**:
    -   Nếu migrate thất bại: Kiểm tra quyền truy cập database hoặc cài đặt `sequelize-cli` toàn cục (`npm install -g sequelize-cli`).
    -   Nếu server không chạy: Kiểm tra port có bị chiếm dụng không.
-   **Cập Nhật Code**: Sau khi pull code mới, luôn chạy `npm install` để cập nhật package nếu có thay đổi trong `package.json`.
-   **Bảo Mật**: Không chia sẻ `.env` hoặc thông tin database công khai.

# API Quản Lý Bệnh Viện

Kho lưu trữ này chứa tài liệu API cho hệ thống quản lý bệnh viện, được xuất từ các bộ sưu tập Postman. API xử lý các chức năng như xác thực người dùng, hoạt động quản trị, quản lý bác sĩ, hồ sơ bệnh nhân, dịch vụ và chuyên khoa.

Hệ thống dường như được thiết kế cho ngữ cảnh bệnh viện Việt Nam (dựa trên tên endpoint và dữ liệu như "Bác sĩ" cho bác sĩ và "Bệnh nhân" cho bệnh nhân). Nó bao gồm các endpoint cho đăng ký, đăng nhập, quản lý hồ sơ, lịch hẹn, và hơn thế nữa.

## Mục Lục

-   [Tổng Quan](#tổng-quan)
-   [Các Endpoint API](#các-endpoint-api)
    -   [Xác Thực](#xác-thực)
    -   [Quản Trị](#quản-trị)
    -   [Bác Sĩ](#bác-sĩ)
    -   [Bệnh Nhân](#bệnh-nhân)
    -   [Chuyên Khoa](#chuyên-khoa)
    -   [Dịch Vụ](#dịch-vụ)
-   [Mã Lỗi](#mã-lỗi)
-   [Đóng Góp](#đóng-góp)
-   [Giấy Phép](#giấy-phép)

## Tổng Quan

API này được xây dựng bằng Node.js (suy ra từ Express.js trong header) và sử dụng JWT để xác thực. Các tính năng chính bao gồm:

-   Đăng ký và đăng nhập người dùng với xác thực OTP.
-   Công cụ quản trị để tạo quản trị viên bệnh viện và quản lý quyền hạn.
-   Quản lý hồ sơ bác sĩ và bệnh nhân.
-   Lập lịch và quản lý lịch hẹn.
-   Lấy thông tin dịch vụ và chuyên khoa.

Tất cả các endpoint đều bắt đầu bằng `/api/`. Xác thực bắt buộc cho các route được bảo vệ bằng Bearer token.

## Các Endpoint API

Các endpoint được nhóm theo bộ sưu tập Postman. Mỗi endpoint bao gồm phương thức, URL, mô tả, body yêu cầu (nếu có), và ví dụ phản hồi.

### Xác Thực

#### 1. Đăng Ký

-   **Phương Thức**: POST
-   **URL**: `/api/auth/register`
-   **Mô Tả**: Đăng ký người dùng mới và gửi OTP đến email.
-   **Body Yêu Cầu**:
    ```json
    {
        "name": "Nguyễn Trung Hiếu",
        "email": "nguyenhieushanley.riot@gmail.com",
        "phone": "11111111111",
        "password": "123456",
        "confirmPassword": "123456"
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Registration successful. Please check your email for OTP."
        }
        ```
    -   Thiếu tham số (200 OK):
        ```json
        {
            "errCode": 1,
            "errMessage": "Missing required parameters"
        }
        ```
    -   Mật khẩu không khớp (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "Password and confirm password do not match"
        }
        ```
    -   Email/số điện thoại đã sử dụng (200 OK):
        ```json
        {
            "errCode": 3,
            "errMessage": "Email or phone number already in use"
        }
        ```

#### 2. Đăng Nhập

-   **Phương Thức**: POST
-   **URL**: `/api/auth/login`
-   **Mô Tả**: Đăng nhập người dùng và trả về access/refresh token.
-   **Body Yêu Cầu**:
    ```json
    {
        "email": "example@test.com",
        "password": "123456"
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Login successful",
            "accessToken": "eyJhbGciOiJIUzI1Ni...",
            "refreshToken": "eyJhbGciOiJIUzI1Ni..."
        }
        ```
    -   Thiếu tham số (200 OK):
        ```json
        {
            "errCode": 1,
            "errMessage": "Missing required parameters"
        }
        ```
    -   Thông tin không hợp lệ (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "Invalid email or password"
        }
        ```

#### 3. Xác Thực OTP

-   **Phương Thức**: POST
-   **URL**: `/api/auth/verify-otp`
-   **Mô Tả**: Xác thực OTP được gửi trong quá trình đăng ký.
-   **Body Yêu Cầu**:
    ```json
    {
        "email": "example@test.com",
        "otp": "123456"
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "OTP verified successfully."
        }
        ```
    -   OTP không hợp lệ (200 OK):
        ```json
        {
            "errCode": 4,
            "errMessage": "OTP is invalid or has expired."
        }
        ```

#### 4. Làm Mới Token

-   **Phương Thức**: POST
-   **URL**: `/api/auth/refresh-token`
-   **Mô Tả**: Tạo access token mới bằng refresh token.
-   **Body Yêu Cầu**:
    ```json
    {
        "refreshToken": "eyJhbGciOiJIUzI1Ni..."
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Token refreshed successfully.",
            "accessToken": "eyJhbGciOiJIUzI1Ni..."
        }
        ```
    -   Token không hợp lệ (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "Invalid refresh token."
        }
        ```

### Quản Trị

#### 1. Tạo Quản Trị Viên Bệnh Viện

-   **Phương Thức**: POST
-   **URL**: `/api/admin/hospital-admin` (Yêu cầu xác thực: Quản trị hệ thống)
-   **Mô Tả**: Tạo tài khoản quản trị viên bệnh viện mới.
-   **Body Yêu Cầu**:
    ```json
    {
        "name": "Hopisal1",
        "email": "Hop1@gmail.com",
        "phone": "1",
        "password": "11111",
        "confirmPassword": "11111"
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Hospital admin created successfully."
        }
        ```
    -   Thiếu tham số (200 OK):
        ```json
        {
            "errCode": 1,
            "errMessage": "Missing required parameters"
        }
        ```
    -   Mật khẩu không khớp (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "Password and confirm password do not match"
        }
        ```
    -   Email/số điện thoại đã sử dụng (200 OK):
        ```json
        {
            "errCode": 3,
            "errMessage": "Email or phone number already in use"
        }
        ```

#### 2. Cấp Quyền Cho Người Dùng

-   **Phương Thức**: POST
-   **URL**: `/api/admin/user-permission` (Yêu cầu xác thực)
-   **Mô Tả**: Cấp quyền hạn cho người dùng.
-   **Body Yêu Cầu**:
    ```json
    {
        "userId": "1",
        "permissionId": "8"
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Permission granted successfully."
        }
        ```
    -   Thiếu tham số (200 OK):
        ```json
        {
            "errCode": 1,
            "errMessage": "Missing required parameters"
        }
        ```
    -   Đã cấp quyền (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "The user has already been granted this permission."
        }
        ```

#### 3. Hủy Quyền Hạn Của Người Dùng

-   **Phương Thức**: DELETE
-   **URL**: `/api/admin/user-permission/:userId/:permissionId` (Yêu cầu xác thực)
-   **Mô Tả**: Hủy quyền hạn của người dùng.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Delete user permission successful"
        }
        ```
    -   Không tìm thấy (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "User permission not found"
        }
        ```

### Bác Sĩ

#### 1. Lấy Tất Cả Bác Sĩ

-   **Phương Thức**: GET
-   **URL**: `/api/doctor/all` (Yêu cầu xác thực)
-   **Mô Tả**: Lấy tất cả bác sĩ với chi tiết người dùng.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Get doctors successful",
            "data": [
                /* mảng đối tượng bác sĩ */
            ]
        }
        ```

#### 2. Lấy Bác Sĩ Theo Chuyên Khoa

-   **Phương Thức**: GET
-   **URL**: `/api/doctor/specialty/:specialtyId`
-   **Mô Tả**: Lấy bác sĩ cho một chuyên khoa cụ thể.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Get doctors successful",
            "data": [
                /* mảng đối tượng bác sĩ */
            ]
        }
        ```
    -   Chuyên khoa không tìm thấy (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "Specialty not found"
        }
        ```

#### 3. Lấy Lịch Hẹn Của Bác Sĩ

-   **Phương Thức**: GET
-   **URL**: `/api/doctor/appointments` (Yêu cầu xác thực: Bác sĩ)
-   **Mô Tả**: Lấy lịch hẹn cho bác sĩ đã xác thực.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Get appointments successful",
            "data": [
                /* mảng đối tượng lịch hẹn */
            ]
        }
        ```

### Bệnh Nhân

#### 1. Lấy Hồ Sơ Bệnh Nhân

-   **Phương Thức**: GET
-   **URL**: `/api/patient/profile` (Yêu cầu xác thực: Bệnh nhân)
-   **Mô Tả**: Lấy hồ sơ bệnh nhân.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Get user successful",
            "data": {
                /* đối tượng bệnh nhân */
            }
        }
        ```

#### 2. Tạo Hồ Sơ Bệnh Nhân

-   **Phương Thức**: POST
-   **URL**: `/api/patient/profile` (Yêu cầu xác thực: Bệnh nhân)
-   **Mô Tả**: Tạo hoặc cập nhật hồ sơ bệnh nhân.
-   **Body Yêu Cầu**:
    ```json
    {
        "dob": "2003-10-22",
        "gender": "1",
        "ethnicity": "Kinh",
        "address": "Bến Tre",
        "insuranceTerm": "2026-1-19",
        "insuranceNumber": "5123125125",
        "familyAddress": "Bến Tre",
        "notePMH": "Suy dinh dưỡng cấp tính"
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Create profile patient successful",
            "data": {
                /* đối tượng bệnh nhân */
            }
        }
        ```

#### 3. Cập Nhật Lịch Hẹn

-   **Phương Thức**: PUT
-   **URL**: `/api/patient/appointments/:id` (Yêu cầu xác thực: Bệnh nhân)
-   **Mô Tả**: Cập nhật lịch hẹn hiện có.
-   **Body Yêu Cầu**:
    ```json
    {
        "doctorId": "1",
        "slotId": "17",
        "serviceId": ""
    }
    ```
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Update appointment successful"
        }
        ```
    -   Không tìm thấy (200 OK):
        ```json
        {
            "errCode": 2,
            "errMessage": "Appointment not found"
        }
        ```
    -   Không phải chủ sở hữu (200 OK):
        ```json
        {
            "errCode": 3,
            "errMessage": "You are not the owner of this appointment"
        }
        ```
    -   Không thể cập nhật (200 OK):
        ```json
        {
            "errCode": 4,
            "errMessage": "You can not update this appointment"
        }
        ```
    -   Loại lịch hẹn không hợp lệ (200 OK):
        ```json
        {
            "errCode": 5,
            "errMessage": "Invalid appointment type"
        }
        ```
    -   Bác sĩ không tìm thấy (200 OK):
        ```json
        {
            "errCode": 6,
            "errMessage": "Doctor not found"
        }
        ```

### Chuyên Khoa

#### 1. Lấy Tất Cả Chuyên Khoa

-   **Phương Thức**: GET
-   **URL**: `/api/specialty`
-   **Mô Tả**: Lấy tất cả chuyên khoa.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Get specialty successful",
            "data": [
                /* mảng đối tượng chuyên khoa */
            ]
        }
        ```

### Dịch Vụ

#### 1. Lấy Tất Cả Dịch Vụ

-   **Phương Thức**: GET
-   **URL**: `/api/service`
-   **Mô Tả**: Lấy tất cả dịch vụ.
-   **Phản Hồi**:
    -   Thành công (200 OK):
        ```json
        {
            "errCode": 0,
            "message": "Get service successful",
            "data": [
                /* mảng đối tượng dịch vụ */
            ]
        }
        ```

## Mã Lỗi

Các mã lỗi phổ biến trong API:

-   `0`: Thành công
-   `1`: Thiếu tham số bắt buộc
-   `2`: Tài nguyên không tìm thấy hoặc đã tồn tại
-   `3`: Không được ủy quyền (ví dụ: không phải chủ sở hữu)
-   `4`: Hành động không hợp lệ (ví dụ: không thể cập nhật)
-   `5`: Loại không hợp lệ
-   `6`: Tài nguyên cụ thể không tìm thấy (ví dụ: bác sĩ)

Tất cả lỗi đều trả về 200 OK với body JSON để nhất quán.

## Đóng Góp

Bạn có thể gửi issue hoặc pull request để cải thiện tài liệu hoặc API.

## Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT.
