/* eslint-disable no-unused-vars */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preEmail = location.state?.email || new URLSearchParams(location.search).get('email') || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-3">Verify your email</h2>
        <Formik
          initialValues={{ email: preEmail, code: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(),
            code: Yup.string().required('Code required'),
            password: Yup.string().min(6, 'Min 6 chars')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await api.post('/auth/verify', values);
              toast.success('Verified! Logging you in.');
              localStorage.setItem('token', res.data.token);
              navigate('/dashboard');
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Failed');
            } finally { setSubmitting(false); }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label className="block mb-1">Email</label>
              <Field name="email" className="w-full p-2 border rounded mb-2" />
              <label className="block mb-1">Code</label>
              <Field name="code" className="w-full p-2 border rounded mb-2" />
              <label className="block mb-1">Password (create)</label>
              <Field name="password" type="password" className="w-full p-2 border rounded mb-2" />
              <button type="submit" disabled={isSubmitting} className="w-full py-2 rounded bg-green-600 text-white">Verify & Continue</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Verify;
