// App.jsx - Updated with MainLayout
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//Contexts
import { UserProvider } from './context/UserContext';
import { ChatProvider } from './context/ChatContext';

// Pages
import { Landing, Profile, Login, SignUp, Browse, About, CreateListing, ItemDetails, MyListings, Matches, Messages } from './pages/Pages';

// Layout
import MainLayout from './components/layout/MainLayout';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

function App() {
  return (
    <Router>
      <UserProvider>
        <ChatProvider>
        <Routes>
          {/* Public Routes */}
          
          
          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />} />
         <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected Routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<Profile />} />
               <Route path="/browse" element={<Browse />} />
          <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/messages" element={<Messages />} />
              {/* <Route path="/messages/:userId" element={<Messages />} /> */}
             <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/my-listings" element={<MyListings />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ChatProvider>
      </UserProvider>
    </Router>
  );
}

export default App;