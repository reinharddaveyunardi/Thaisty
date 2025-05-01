import {View} from "react-native";
import {useState} from "react";
import AuthInput from "../../components/AuthInput";

export default function StepOneCustomer({
    email,
    setEmail,
    fullName,
    setFullName,
    password,
    setPassword,
    emailNotFilled,
    setEmailNotFilled,
    fullNameNotFilled,
    setFullNameNotFilled,
    passwordNotFilled,
    setPasswordNotFilled,
}: {
    email: string;
    setEmail: (email: string) => void;
    fullName: string;
    setFullName: (fullName: string) => void;
    password: string;
    setPassword: (password: string) => void;
    emailNotFilled: boolean;
    setEmailNotFilled: (emailNotFilled: boolean) => void;
    fullNameNotFilled: boolean;
    setFullNameNotFilled: (fullNameNotFilled: boolean) => void;
    passwordNotFilled: boolean;
    setPasswordNotFilled: (passwordNotFilled: boolean) => void;
}) {
    const [hidePassword, setHidePassword] = useState(true);
    return (
        <View style={{padding: 16, gap: 4}}>
            <AuthInput
                label="Email"
                placeholder="Enter your Email"
                forPassword={false}
                value={email}
                onChangeText={(value) => setEmail(value)}
                conditionBorder={emailNotFilled}
            />
            <AuthInput
                label="Full Name"
                placeholder="Enter your Full Name"
                forPassword={false}
                value={fullName}
                onChangeText={(value) => setFullName(value)}
                conditionBorder={fullNameNotFilled}
            />
            <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                forPassword
                textContentType="password"
                passwordStatus={hidePassword}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={hidePassword}
                conditionBorder={passwordNotFilled}
                triggerSecureTextEntry={() => setHidePassword((previous) => !previous)}
            />
        </View>
    );
}
