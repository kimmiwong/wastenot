import { useState } from "react"
export default function ResetPassword() {
    const [username, setUsername] = useState("");
    const [question, setQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
    <p>Enter email</p>)
}
