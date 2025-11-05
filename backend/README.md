# Hướng Dẫn Cài Đặt Backend

Chào mừng bạn đến với hướng dẫn cài đặt backend cho hệ thống quản lý bệnh viện! Hướng dẫn này sẽ giúp bạn thiết lập môi trường phát triển một cách nhanh chóng và dễ dàng. Backend được xây dựng bằng Node.js với Express.js và sử dụng Sequelize làm ORM để kết nối với MySQL.

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

Nếu gặp vấn đề, hãy mở issue trên GitHub hoặc liên hệ maintainer. Chúc bạn cài đặt thành công! 🚀

# Tài Liệu API Quản Lý Bệnh Viện

Kho lưu trữ này chứa tài liệu API cho hệ thống quản lý bệnh viện, được xuất từ các bộ sưu tập Postman. API xử lý các chức năng như xác thực người dùng, quản lý bệnh nhân, quản lý bác sĩ, chuyên khoa, dịch vụ và các nhiệm vụ quản trị. Nó được xây dựng bằng Node.js (Express) và sử dụng JWT cho xác thực khi cần thiết.

API được lưu trữ cục bộ tại `http://localhost:PORT` trong các ví dụ, nhưng có thể triển khai lên môi trường sản xuất.

## Mục Lục

-   [Yêu Cầu Trước](#yêu-cầu-trước)
-   [Xác Thực](#xác-thực)
-   [Các Endpoint API](#các-endpoint-api)
    -   [Dịch Vụ](#dịch-vụ)
    -   [Chuyên Khoa](#chuyên-khoa)
    -   [Bệnh Nhân](#bệnh-nhân)
    -   [Bác Sĩ](#bác-sĩ)
    -   [Xác Thực Bệnh Nhân](#xác-thực-bệnh-nhân)
    -   [Quản Trị Viên](#quản-trị-viên)
-   [Mã Lỗi](#mã-lỗi)
-   [Ví Dụ](#ví-dụ)
-   [Đóng Góp](#đóng-góp)

## Yêu Cầu Trước

-   Node.js v14+
-   Cơ Sở Dữ Liệu: MySQL (hoặc tương tự, dựa trên giả định ORM Sequelize từ mã)
-   Biến Môi Trường: Thiết lập `.env` với các khóa như `JWT_SECRET`, `DB_HOST`, v.v.
-   Cài Đặt Phụ Thuộc: `npm install`
-   Chạy Máy Chủ: `npm start`

Xác thực sử dụng JWT Bearer token cho các route được bảo vệ. Bao gồm token trong header `Authorization` dưới dạng `Bearer <token>`.

## Xác Thực

Hầu hết các endpoint yêu cầu xác thực JWT, đặc biệt là những endpoint sửa đổi dữ liệu. Các endpoint công khai (ví dụ: GET tất cả dịch vụ) không yêu cầu.

-   **Vai Trò**: `admin`, `hospital-admin`, `doctor`, `patient`
-   **Hết Hạn Token**: Thường là 1 giờ (dựa trên ví dụ).

## Các Endpoint API

Các endpoint được nhóm theo danh mục. Mỗi endpoint bao gồm phương thức, đường dẫn, mô tả, tham số yêu cầu và phản hồi mẫu.

### Dịch Vụ

Các endpoint để quản lý dịch vụ bệnh viện.

| Phương Thức | Endpoint     | Mô Tả              | Xác Thực | Tham Số |
| ----------- | ------------ | ------------------ | -------- | ------- |
| GET         | /api/service | Lấy tất cả dịch vụ | Không    | Không   |

**Phản Hồi Mẫu (Thành Công - 200 OK)**:

```json
{
  "errCode": 0,
  "message": "Get services successful",
  "data": [
    { "id": 1, "name": "Khám tổng quát", "description": "...", ... }
    // Các dịch vụ khác...
  ]
}
```

### Chuyên Khoa

Các endpoint để quản lý chuyên khoa y tế.

| Phương Thức | Endpoint       | Mô Tả                  | Xác Thực | Tham Số |
| ----------- | -------------- | ---------------------- | -------- | ------- |
| GET         | /api/specialty | Lấy tất cả chuyên khoa | Không    | Không   |

**Phản Hồi Mẫu (Thành Công - 200 OK)**:

```json
{
  "errCode": 0,
  "message": "Get specialty successful",
  "data": [
    { "id": 1, "name": "Nội tổng quát", "description": "...", ... }
    // Các chuyên khoa khác...
  ]
}
```

**Phản Hồi Lỗi (Không Tìm Thấy - 200 OK với errCode)**:

```json
{ "errCode": 2, "errMessage": "Specialty not found" }
```

### Bệnh Nhân

Các endpoint để quản lý hồ sơ bệnh nhân. Yêu cầu vai trò bệnh nhân hoặc admin.

| Phương Thức | Endpoint                | Mô Tả                    | Xác Thực              | Tham Số                                                                                       |
| ----------- | ----------------------- | ------------------------ | --------------------- | --------------------------------------------------------------------------------------------- |
| GET         | /api/patient/detail/:id | Lấy chi tiết bệnh nhân   | JWT (Admin/Bệnh Nhân) | Đường dẫn: id (userId)                                                                        |
| POST        | /api/patient            | Tạo hồ sơ bệnh nhân      | JWT (Bệnh Nhân)       | Thân: dob, gender, ethnicity, address, insuranceTerm, insuranceNumber, familyAddress, notePMH |
| PUT         | /api/patient/:id        | Cập nhật hồ sơ bệnh nhân | JWT (Bệnh Nhân)       | Đường dẫn: id (userId)<br>Thân: Giống POST                                                    |
| DELETE      | /api/patient/:id        | Xóa hồ sơ bệnh nhân      | JWT (Bệnh Nhân)       | Đường dẫn: id (userId)                                                                        |

**Thân Yêu Cầu Mẫu (POST/PUT)**:

```json
{
    "dob": "2003-10-22",
    "gender": "1", // 1: Nam, 0: Nữ
    "ethnicity": "Kinh",
    "address": "HCM",
    "insuranceTerm": "",
    "insuranceNumber": "",
    "familyAddress": "HCM",
    "notePMH": ""
}
```

**Phản Hồi Mẫu (GET Thành Công - 200 OK)**:

```json
{
    "errCode": 0,
    "message": "Get user successful",
    "data": {
        "id": 1,
        "userId": 3,
        "dob": "1999-05-14T00:00:00.000Z",
        // Các trường khác...
        "user": { "name": "Lê Thị Mai", "email": "...", "phone": "..." }
    }
}
```

**Phản Hồi Lỗi**:

-   Thiếu tham số: `{ "errCode": 1, "errMessage": "Missing required parameters" }`
-   Không phải bệnh nhân: `{ "errCode": 2, "errMessage": "You are not a patient" }`
-   Không tìm thấy người dùng: `{ "errCode": 3, "errMessage": "User not found" }`

### Bác Sĩ

Các endpoint để quản lý bác sĩ. Yêu cầu vai trò admin hoặc hospital-admin cho các thay đổi.

| Phương Thức | Endpoint                    | Mô Tả               | Xác Thực    | Tham Số                                                                          |
| ----------- | --------------------------- | ------------------- | ----------- | -------------------------------------------------------------------------------- |
| GET         | /api/doctor/all             | Lấy tất cả bác sĩ   | JWT         | Không                                                                            |
| GET         | /api/doctor/:id             | Lấy một bác sĩ      | JWT         | Đường dẫn: id (doctorId)                                                         |
| POST        | /api/doctor                 | Tạo bác sĩ          | JWT (Admin) | Thân: userId, specialtyId, dob, gender, ethnicity, address, degree, room, status |
| PUT         | /api/doctor/:id             | Cập nhật bác sĩ     | JWT (Admin) | Đường dẫn: id<br>Thân: Giống POST                                                |
| DELETE      | /api/doctor/:id             | Xóa bác sĩ          | JWT (Admin) | Đường dẫn: id                                                                    |
| GET         | /api/doctor/slots/:doctorId | Lấy slot của bác sĩ | Không       | Đường dẫn: doctorId<br>Truy vấn: date (YYYY-MM-DD)                               |

**Thân Yêu Cầu Mẫu (POST/PUT)**:

```json
{
    "userId": 13,
    "specialtyId": 1,
    "dob": "1980-03-12",
    "gender": "1",
    "ethnicity": "Kinh",
    "address": "123 Nguyễn Trãi, Hà Nội",
    "degree": "Bác sĩ chuyên khoa II - Nội tổng quát",
    "room": "101",
    "status": "active"
}
```

**Phản Hồi Mẫu (GET All - 200 OK)**:

```json
{
  "errCode": 0,
  "message": "Get doctors successful",
  "data": [
    { "id": 1, "userId": 13, "specialtyId": 1, ... }
    // Các bác sĩ khác...
  ]
}
```

**Phản Hồi Mẫu (GET Slots - 200 OK)**:

```json
{
  "errCode": 0,
  "message": "Get slots successful",
  "data": [
    { "id": 1, "doctorId": 1, "scheduleId": 1, "startTime": "...", ... }
    // Các slot khác...
  ]
}
```

**Phản Hồi Lỗi**:

-   Thiếu tham số: `{ "errCode": 1, "errMessage": "Missing required parameters" }`
-   Không tìm thấy bác sĩ: `{ "errCode": 2, "errMessage": "Doctor not found" }`

### Xác Thực Bệnh Nhân

Các endpoint cho đăng ký, đăng nhập và quản lý hồ sơ bệnh nhân.

| Phương Thức | Endpoint                  | Mô Tả                    | Xác Thực        | Tham Số                                              |
| ----------- | ------------------------- | ------------------------ | --------------- | ---------------------------------------------------- |
| POST        | /api/auth/register        | Đăng ký bệnh nhân mới    | Không           | Thân: name, email, phone, password, confirmPassword  |
| POST        | /api/auth/verify-otp      | Xác thực OTP             | Không           | Thân: email, otp                                     |
| POST        | /api/auth/login           | Đăng nhập                | Không           | Thân: email, password                                |
| POST        | /api/auth/forgot-password | Quên mật khẩu (gửi OTP)  | Không           | Thân: email                                          |
| POST        | /api/auth/reset-password  | Đặt lại mật khẩu         | Không           | Thân: email, otp, newPassword, confirmNewPassword    |
| GET         | /api/patient/profile      | Lấy hồ sơ bệnh nhân      | JWT (Bệnh Nhân) | Không                                                |
| PUT         | /api/patient/profile      | Cập nhật hồ sơ bệnh nhân | JWT (Bệnh Nhân) | Thân: name, phone, dob, gender, insurance, allergies |

**Thân Yêu Cầu Mẫu (Đăng Ký)**:

```json
{
    "name": "Hieu",
    "email": "johan58085@dwakm.com",
    "phone": "0123456789",
    "password": "123456",
    "confirmPassword": "123456"
}
```

**Phản Hồi Mẫu (Đăng Ký Thành Công - 200 OK)**:

```json
{
    "errCode": 0,
    "errMessage": "Registration successful. Please check your email for OTP."
}
```

**Phản Hồi Lỗi**:

-   Mật khẩu không khớp: `{ "errCode": 2, "errMessage": "Password and confirm password do not match" }`
-   Email/SĐT đã sử dụng: `{ "errCode": 3, "errMessage": "Email or phone number is already in use" }`
-   OTP không hợp lệ: `{ "errCode": 4, "errMessage": "Invalid OTP" }`

### Quản Trị Viên

Các endpoint cho nhiệm vụ admin siêu cấp, như tạo admin bệnh viện và lịch trình. Yêu cầu vai trò admin.

| Phương Thức | Endpoint                       | Mô Tả                       | Xác Thực    | Tham Số                                                                                            |
| ----------- | ------------------------------ | --------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| POST        | /api/admin/hospital-admin      | Tạo admin bệnh viện         | JWT (Admin) | Thân: name, email, phone, password, confirmPassword                                                |
| POST        | /api/admin/schedules/:doctorId | Tạo lịch và slot cho bác sĩ | JWT (Admin) | Đường dẫn: doctorId<br>Thân: name, workDate (YYYY-MM-DD), shift (mảng ví dụ: ["C1", "C2"]), status |

**Thân Yêu Cầu Mẫu (Tạo Admin Bệnh Viện)**:

```json
{
    "name": "Hopisal1",
    "email": "Hop1@gmail.com",
    "phone": "1",
    "password": "11111",
    "confirmPassword": "11111"
}
```

**Phản Hồi Mẫu (Thành Công - 200 OK)**:

```json
{
    "errCode": 0,
    "message": "Create hospital admin successful"
}
```

**Thân Yêu Cầu Mẫu (Tạo Lịch)**:

```json
{
    "name": "AAA",
    "workDate": "2025-11-05",
    "shift": ["C2"],
    "status": "active"
}
```

**Phản Hồi Lỗi**:

-   Ca làm việc không hợp lệ: `{ "errCode": 2, "errMessage": "Invalid shift C22" }`
-   Lịch đã tồn tại: `{ "errCode": 3, "errMessage": "Schedule for shift C2 on 2025-11-05 already exists" }`

## Mã Lỗi

Cấu trúc lỗi phổ biến: `{ "errCode": X, "errMessage": "..." }`

-   0: Thành công
-   1: Thiếu tham số
-   2: Lỗi xác thực (ví dụ: không tìm thấy, không khớp, vai trò không hợp lệ)
-   3: Tài nguyên tồn tại hoặc không tìm thấy
-   4: OTP hoặc token không hợp lệ

## Ví Dụ

Sử dụng công cụ như Postman hoặc curl để kiểm tra.

**Ví Dụ curl (Đăng Ký)**:

```bash
curl -X POST http://localhost:PORT/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Test", "email": "test@example.com", "phone": "123456789", "password": "pass123", "confirmPassword": "pass123"}'
```

## Đóng Góp

Fork kho, thực hiện thay đổi và gửi PR. Đảm bảo cập nhật kiểm tra và tài liệu.
