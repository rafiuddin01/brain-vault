/* eslint-disable no-unused-vars */
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <Formik
          initialValues={{ name: '', email: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name required'),
            email: Yup.string().email('Invalid email').required('Email required')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.post('/auth/register', values);
              toast.success('Verification code sent. Check your email.');
              navigate('/verify', { state: { email: values.email } });
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Failed');
            } finally { setSubmitting(false); }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label className="block mb-1">Name</label>
              <Field name="name" className="w-full p-2 border rounded mb-2" />
              <div className="text-red-500 text-sm mb-2"><ErrorMessage name="name" /></div>

              <label className="block mb-1">Email</label>
              <Field name="email" className="w-full p-2 border rounded mb-2" />
              <div className="text-red-500 text-sm mb-2"><ErrorMessage name="email" /></div>

              <button type="submit" disabled={isSubmitting} className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                Send verification
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
