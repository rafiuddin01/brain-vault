/* eslint-disable no-unused-vars */
// src/pages/Login.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>
        <p className="text-sm text-slate-500 mb-6">Login to access your BrainVault dashboard</p>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await api.post('/auth/login', values);
              const token = res.data.token;
              if (!token) throw new Error('No token received');
              localStorage.setItem('token', token);
              toast.success('Logged in — redirecting to dashboard');
              navigate('/dashboard');
            } catch (err) {
              const msg = err?.response?.data?.message || err.message || 'Login failed';
              toast.error(msg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <div className="text-red-500 text-xs mb-2"><ErrorMessage name="email" /></div>

              <label className="block text-sm font-medium mb-1">Password</label>
              <Field
                name="password"
                type="password"
                className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <div className="text-red-500 text-xs mb-3"><ErrorMessage name="password" /></div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center text-sm text-slate-600">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </div>

        <div className="mt-3 text-center text-xs text-slate-400">
          <Link to="/forgot" className="hover:underline">Forgot password?</Link>
        </div>
      </motion.div>
    </div>
  );
}
