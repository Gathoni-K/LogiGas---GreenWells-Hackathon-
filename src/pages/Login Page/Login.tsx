import styles from './Login.module.css';
import Footer from '../../components/Footer';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const {
        register, 
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setLoginError('');
        
        try {
            const response = await fetch('https://logigas-backend.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Save token and user data to localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                console.log('Login successful:', result);
                navigate("/dashboard");
            } else {
                setLoginError(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Network error. Please try again.');
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.form}>
                <div className={styles.leftSide}>
                    <img src="background.png" className={styles.image}/>
                </div>

                <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.header}>
                        <img src="logo.png" className={styles.logo}/>
                        <h2 className={styles.companyName}>LogiGas</h2>
                    </div>

                    <div className={styles.extraInfo}>
                        <h3>Welcome Back!!</h3>
                        <p>Enter your details below:</p>
                    </div>

                    <div className={styles.formContent}>
                        {/* Email Field */}
                        <label>Your Email:</label> <br />
                        <input 
                            type="email" 
                            className={styles.inputField} 
                            id="email" 
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email"
                                }
                            })}
                        />
                        {errors.email && <span className={styles.error}>{errors.email.message}</span>}

                        <label>Your Password:</label> <br />
                        <input 
                            type="password" 
                            className={styles.inputField} 
                            id="password" 
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && <span className={styles.error}>{errors.password.message}</span>}

                        {/* Login Error Message */}
                        {loginError && <span className={styles.error}>{loginError}</span>}

                        <button 
                            className={styles.button} 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>

                        {/* Demo Accounts Info */}
                        <div className={styles.demoAccounts}>
                            <p><strong>Demo Accounts:</strong></p>
                            <p><strong>Dispatcher:</strong> dispatcher@greenwells.com / greenwells123</p>
                            <p><strong>Manager:</strong> manager@greenwells.com / greenwells123</p>
                            <p><strong>Admin:</strong> admin@greenwells.com / greenwells123</p>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Login;