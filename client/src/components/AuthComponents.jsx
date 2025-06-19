import { useActionState } from "react";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: 'Login fallito. Controlla le tue credenziali.' };
        }
    }

    return (
        <>
            { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }
            <Row className="justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Col xs={12} md={6} lg={4}>
                    <Form action={formAction} className="p-4 border rounded bg-white shadow">
                        <Form.Group controlId='username' className='mb-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' name='username' required />
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name='password' required minLength={6} />
                        </Form.Group>

                        {state.error && <p className="text-danger">{state.error}</p>}

                        <Button type='submit' disabled={isPending}>Login</Button>
                        <Link className='btn btn-danger mx-2 my-2' to={'/'} disabled={isPending}>Cancel</Link>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

function LogoutButton(props) {
  return <Button variant='outline-light' onClick={props.logout} disabled={props.disabled}>Logout</Button>;
}

export { LoginForm, LogoutButton };