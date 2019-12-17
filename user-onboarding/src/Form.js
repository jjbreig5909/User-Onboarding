import React, {useState, useEffect} from 'react';
import {withFormik, Form, Field} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


const UserForm = ({values, errors, touched, status}) =>{
    const [users, setUsers] = useState([]);

    useEffect(() => {
        status && setUsers(users => [...users, status]);
    }, [status]);
    return(
        <div className="user-form-container">
            <Form className="user-form">
                <label htmlFor="name">
                    Name: 
                    <Field
                    className="form-field"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="User's name..."
                    />
                    {touched.name && errors.name && (
                        <p className="errors">{errors.name}</p>
                    )}
                </label>
                <label htmlFor="Email">
                    Email: 
                    <Field
                    className="form-field"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="User's email..."/>
                    {touched.email && errors.email && (
                        <p className="errors">{errors.email}</p>
                    )}
                </label>
                <label htmlFor="password">
                    Password: 
                    <Field
                        className="form-field"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="User's password..."
                    />
                    {touched.password && errors.password && (
                        <p className="errors">{errors.password}</p>
                    )}
                </label>
                <label className="checkbox-container">
                    Do you accept the Terms of Service?
                    <Field
                        className="form-field-checkbox"
                        type="checkbox"
                        name="termsOfService"
                        checked={values.termsOfService}
                    />
                    <span className="checkmark" />
                    {touched.termsOfService && errors.termsOfService && (
                        <p className="errors">{errors.termsOfService}</p>
                    )}
                </label>
                <button type="submit">Submit</button>
            </Form>
            {users.map(user => {
                return (
                    <ul key={user.id}>
                        <li><span className="user-data">User's Name:</span> {user.name}</li>
                        <li><span className="user-data">User's Email:</span> {user.email}</li>
                        <li><span className="user-data">User's Password:</span> {user.password}</li>
                        <li><span className="user-data">Accepted terms of service?</span> {user.termsOfService.toString()}</li>
                    </ul>
                );
            })}
        </div>
    );
};

const FormikUserForm = withFormik({
    mapPropsToValues(props) {
        return{
            name: props.name || "",
            email: props.email || "",
            password: props.password || "",
            termsOfService: props.termsOfService || false
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup
            .string()
            .required('Your name is required'),
        email: Yup
            .string()
            .required('Email input required'),
        password: Yup
            .string()
            .min(6, 'Password must be 6 characters or longer')
            .required('A password is required'),
        termsOfService: Yup
            .bool()
            .oneOf([true], 'You must accept the terms of service to continue')
    }),
    handleSubmit(values, { setStatus, resetForm }) {
        console.log("submitting", values);
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                console.log("success", res);
                setStatus(res.data);

                resetForm();
            })
            .catch(err => console.log(err.response));
    }
})(UserForm);
export default FormikUserForm;

