import {FcGoogle, FcLink} from "react-icons/fc";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {useGoogleLogin} from "@react-oauth/google";
import FormWrapper from "@/components/foms/formWrapper";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    createFileRoute, Link,
    useNavigate,
} from "@tanstack/react-router";
import {useAuth} from "@/hooks/useAuth";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean(),
});

interface LoginProps {
    heading?: string;
    subheading?: string;
    logo?: {
        url: string;
        src: string;
        alt: string;
    };
    loginText?: string;
    googleText?: string;
    signupText?: string;
    signupUrl?: string;
    redirectUrl?: string;
}

export const Login = ({
                   heading = "Welcome Back",
                   subheading = "Sign in to your account",
                   loginText = "Sign In",
                   googleText = "Continue with Google",
                   signupText = "Don't have an account?",
                   signupUrl = "register",
                   redirectUrl = "/admin/users",
               }: LoginProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {basicLogin, socialLogin, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            await basicLogin(values.email, values.password);
            _navigate();
        } catch (error: any) {
            console.log(error);
            setError(error instanceof Error ? error.message : "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin(
        {
            onSuccess: async (tokenResponse) => {
                setIsLoading(true);
                try {
                    await socialLogin({provider: "google", data: tokenResponse});
                    _navigate();
                } catch (error) {
                    setError("Google login failed, please try again.");
                } finally {
                    setIsLoading(false);
                }
            },

            onError: () => {
                setError("OAuth error, please try again.");
                setIsLoading(false);
            },
            onNonOAuthError: () => {
                setError("Non-OAuth error, please try again.");
                setIsLoading(false);
            },
            scope: "openid email profile",
        });

    const _navigate = (overrideUrl: string = redirectUrl) => {
        setTimeout(() => {
            navigate({to: overrideUrl, replace: true});
        }, 100);
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate({to: redirectUrl});
        }
    }, [isAuthenticated, navigate, redirectUrl]);

    return (
        <FormWrapper
            heading={heading}
            subheading={subheading}
            isLoading={isLoading}
            error={error}
            onErrorDismiss={() => setError(null)}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between items-center">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({field}) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            id="remember"
                                            className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormLabel
                                        htmlFor="remember"
                                        className="text-sm text-gray-700 font-medium cursor-pointer"
                                    >
                                        Remember me
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <Link
                            to={'/requestNewPassword'}
                            className="text-sm text-gray-600 hover:text-black hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white font-semibold transition-colors duration-200"
                        disabled={isLoading}
                        size="lg"
                    >
                        {isLoading ? "Signing in..." : loginText}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors duration-200"
                        disabled={isLoading}
                        onClick={() => {
                            _navigate("/requestMagicLink")
                        }}
                        type="button"
                        size="lg"
                    >
                        <FcLink className="mr-2 size-5"/>
                        Magic Link
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors duration-200"
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                            googleLogin();
                        }}
                        size="lg"
                    >
                        <FcGoogle className="mr-2 size-5"/>
                        {googleText}
                    </Button>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {signupText}{" "}
                            <a
                                href={signupUrl}
                                className="font-medium text-black hover:text-gray-700 hover:underline"
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    );
};

