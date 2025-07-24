# Digi-Shamba

## Overview
Digi-Shamba is a modern farm management web application designed to help farmers and administrators efficiently manage daily records, analytics, resources, and livestock. The platform features secure authentication, responsive design, and a resource hub for actionable loan information.

## Live Demo
Access the live application here:  
[https://digi-shamba.vercel.app/](https://digi-shamba.vercel.app/)

## Test Accounts
Use these credentials to test the application:

- **Admin Account**:
  - Email: qq@gmail.com
  - Password: 123456

- **Farmer Account**:
  - Email: kenyapast@gmail.com
  - Password: 123456

## Tech Stack
- **Frontend**: React with Vite, hosted on Vercel
- **Backend**: Node.js/Express, hosted on Render
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS

## Features
- User authentication (farmer/admin)
- Dashboard for farm management
- Daily records and analytics
- Resource hub with loan information
- Add and manage farm animals
- Admin dashboard
- User profile management
- Responsive design
- SPA routing (compatible with Vercel/Netlify)

## Screenshots
Here are some screenshots of the application:
## Screenshots
Here are some screenshots of the application:

![Screenshot 1](./client/src/images/screenshot(376).png)
![Screenshot 2](./client/src/images/screenshot(377).png)
![Screenshot 3](./client/src/images/screenshot(378).png)
![Screenshot 4](./client/src/images/screenshot(379).png)
![Screenshot 5](./client/src/images/screenshot(380).png)
![Screenshot 6](./client/src/images/screenshot(381).png)
![Screenshot 7](./client/src/images/screenshot(382).png)
![Screenshot 8](./client/src/images/screenshot(383).png)

## Demo Video

Check out the demo video [here](https://drive.google.com/file/d/1XW3Nuo58AfgEEZ6CStt67znfzNthLw2P/view) for a walkthrough of the application.

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- pnpm (or npm/yarn)
- Git

### 1. Clone the Repository
```sh
git clone https://github.com/briankush/Digi-Shamba.git
cd Digi-Shamba
```

### 2. Install Dependencies

#### Frontend
```sh
cd client
pnpm install
```
Or use `npm install` if you prefer npm.

#### Backend
```sh
cd ../server
pnpm install
```
Or use `npm install` if you prefer npm.

### 3. Environment Variables

#### Frontend (`client/.env`)
Create a `.env` file in the `client` folder:

```
VITE_API_URL=<your_backend_api_url>
```
Replace `<your_backend_api_url>` with the actual URL of your backend API.

#### Backend (`server/.env`)
Create a `.env` file in the `server` folder:

```
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Replace the placeholders with your actual MongoDB connection string and a secret key for JWT.

### 4. Running the Application

#### Frontend
```sh
cd client
pnpm run dev
```
Or use `npm run dev` if you prefer npm.

#### Backend
```sh
cd server
pnpm run dev
```
Or use `npm run dev` if you prefer npm.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by the need for efficient farm management solutions
- Designed for farmers and administrators seeking modern technological solutions
