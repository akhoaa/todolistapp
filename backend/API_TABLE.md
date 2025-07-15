# API Table — Backend (NestJS)

| Method | Endpoint                       | Mô tả                        | Input (Body/Query/Param)         | Output (JSON)                  | Auth  | Status |
|--------|-------------------------------|------------------------------|----------------------------------|-------------------------------|-------|--------|
| POST   | /auth/signup                  | Đăng ký                      | `{ name, email, password }`      | `{ token }`                   | Không | ✅ Đã có, chuẩn hóa |
| POST   | /auth/signin                  | Đăng nhập                    | `{ email, password }`            | `{ token }`                   | Không | ✅ Đã có, chuẩn hóa |
| POST   | /auth/forgot-password         | Gửi OTP quên mật khẩu        | `{ email }`                      | `{ message }`                 | Không | ✅ Đã có, chuẩn hóa |
| POST   | /auth/reset-password          | Đặt lại mật khẩu             | `{ email, otp, newPassword }`    | `{ message }`                 | Không | ✅ Đã có, chuẩn hóa |
| POST   | /auth/verify                  | Xác thực tài khoản           | `{ email, otp }`                 | `{ message }`                 | Không | ✅ Đã có, chuẩn hóa |
| GET    | /users/me                     | Lấy thông tin user           | -                                | `{ user }`                    | JWT   | ✅ Đã có, chuẩn hóa |
| PUT    | /users/me                     | Cập nhật thông tin user      | `{ name?, email?, password? }`   | `{ user }`                    | JWT   | ✅ Đã có, chuẩn hóa |
| POST   | /tasks                        | Tạo task mới                 | `{ title, description?, date }`  | `{ task }`                    | JWT   | ✅ Đã có, chuẩn hóa |
| GET    | /tasks                        | Lấy danh sách task           | `?date, ?page, ?limit, ?completed` | `{ data, page, limit, total }` | JWT   | ✅ Đã có, chuẩn hóa |
| GET    | /tasks/:id                    | Lấy chi tiết task            | `:id`                            | `{ task }`                    | JWT   | ✅ Đã có, chuẩn hóa |
| PUT    | /tasks/:id                    | Cập nhật task                | `{ title?, description?, date?, completed? }` | `{ task }` | JWT   | ✅ Đã có, chuẩn hóa |
| DELETE | /tasks/:id                    | Xóa task                     | `:id`                            | `{ message }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| POST   | /projects                     | Tạo project mới              | `{ name, description? }`         | `{ project }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| GET    | /projects                     | Lấy danh sách project        | `?name, ?page, ?limit`           | `{ data, page, limit, total }`| JWT   | ✅ Đã có, chuẩn hóa |
| GET    | /projects/:id                 | Lấy chi tiết project         | `:id`                            | `{ project }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| PUT    | /projects/:id                 | Cập nhật project             | `{ name?, description? }`        | `{ project }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| DELETE | /projects/:id                 | Xóa project                  | `:id`                            | `{ message }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| POST   | /projects/:id/members         | Thêm thành viên vào project  | `{ userId }`                     | `{ project }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| DELETE | /projects/:id/members/:userId | Xóa thành viên khỏi project  | `:id, :userId`                   | `{ project }`                 | JWT   | ✅ Đã có, chuẩn hóa |
| GET    | /admin/users                  | Danh sách user (admin)       | `?page, ?limit, ?search`         | `{ data, page, limit, total }`| Admin | ✅ Đã có, chuẩn hóa |
| GET    | /admin/users/:id              | Chi tiết user (admin)        | `:id`                            | `{ user }`                    | Admin | ✅ Đã có, chuẩn hóa |
| PUT    | /admin/users/:id              | Cập nhật user (admin)        | `{ name?, email?, role? }`       | `{ user }`                    | Admin | ✅ Đã có, chuẩn hóa |
| DELETE | /admin/users/:id              | Xóa user (admin)             | `:id`                            | `{ message }`                 | Admin | ✅ Đã có, chuẩn hóa |
| GET    | /admin/report/tasks           | Báo cáo task (admin)         | `?date, ?userId`                 | `{ data }`                    | Admin | ✅ Đã có, chuẩn hóa |
| GET    | /admin/report/users           | Báo cáo user (admin)         | -                                | `{ data }`                    | Admin | ✅ Đã có, chuẩn hóa |

---

## Ghi chú
- ✅ Đã có, chuẩn hóa: API đã có, đã dùng decorator, exception, try-catch, filter, code clean.
- Nếu muốn thêm API mới, bổ sung vào bảng này và đánh dấu TODO.
- Nếu cần refactor, ghi chú rõ ở cột Status.

---

## Ví dụ JSON Response

**Thành công:**
```json
{
  "data": [ ... ],
  "page": 1,
  "limit": 10,
  "total": 100
}
```
Hoặc:
```json
{
  "message": "Task deleted"
}
```
Hoặc:
```json
{
  "token": "jwt_token_here"
}
```

**Lỗi:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
Hoặc:
```json
{
  "statusCode": 400,
  "message": "Email already exists"
}
```

---

- Tất cả API trả về JSON.
- Các API yêu cầu JWT thì phải gửi Authorization: Bearer `<token>` (hoặc cookie JWT nếu FE dùng cookie).
- Các API `/admin/*` chỉ dành cho user có role `admin`.
- Bạn có thể xem chi tiết schema input/output tại Swagger: `http://localhost:3000/api`. 