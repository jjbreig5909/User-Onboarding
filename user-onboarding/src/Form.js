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
        <div>
            <Form>
                <label htmlFor="name">
                    Name
                    <Field
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
                    Email
                    <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="User's email..."/>
                    {touched.email && errors.email && (
                        <p className="errors">{errors.email}</p>
                    )}
                </label>
                <label htmlFor="password">
                    Password
                    <Field
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
                        <li>User's Name: {user.name}</li>
                        <li>User's Email: {user.email}</li>
                        <li>User's Password: {user.password}</li>
                        <li>Accepted terms of service?: {user.termsOfService}</li>
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
                // sends a status update through props in AnimalForm with value as res.data content
                setStatus(res.data);

                //clears form inputs, from FormikBag
                resetForm();
            })
            .catch(err => console.log(err.response));
    }
})(UserForm);
export default FormikUserForm;

