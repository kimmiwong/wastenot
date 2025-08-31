import { useState } from "react"
import { useNavigate } from "react-router";

export default function ResetPassword() {
    const [username, setUsername] = useState("");
    const [question, setQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
    <p>Enter email</p>)
}
