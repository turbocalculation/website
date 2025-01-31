"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import userIco2 from "@/assets/uuse.svg";
import { useRouter } from "next/navigation";
import { useLogin } from "@/query/queries/AuthQueries";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "กรุณากรอกชื่อผู้ใช้งานให้ถูกต้อง",
  }),
  password: z.string().min(1, {
    message: "กรุณากรอกรหัสผ่าน",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { setError } = form;

  const LoginAction = useLogin();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const data = await LoginAction.mutateAsync({
      username: values.username,
      password: values.password,
    });

    if (data?.error) {
      if (data?.error === "Invalid username or password") {
        return setError("username", {
          type: "manual",
          message: "Invalid username or password",
        });
      }
      if (data?.error === "Email not verified") {
        setError("username", {
          type: "manual",
          message: "ระบบได้ส่งอีเมล์ยืนยันการสมัครสมาชิกไปยังอีเมล์ของคุณแล้ว",
        });
        return setTimeout(() => {
          router.push("/verifyemail");
        }, 5000);
      }
    }
    if (data?.redirect) {
      router.push(data.redirect);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className=" w-32 h-32 mx-auto  ">
          <Image
            src={userIco2}
            alt="user icon"
            width={128}
            height={128}
            className=" w-full h-full border-2 border-primary rounded-full"
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  placeholder="username"
                  className=" w-72 text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className=" absolute text-[10px] w-full mt-1 pl-3 " />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  placeholder="password"
                  className=" w-72 text-sm"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage className=" absolute text-[10px] w-full mt-1 pl-3 " />
            </FormItem>
          )}
        />
        <div className=" w-40 mx-auto">
          <Button
            type="submit"
            className=" w-40 mx-auto"
            disabled={LoginAction.isPending}
          >
            {LoginAction.isPending ? (
              <LoaderCircle className=" w-6 h-6 mx-auto" />
            ) : (
              "Login"
            )}
          </Button>
        </div>
        <div className=" w-48 mx-auto pt-10">
          <Button
            type="button"
            onClick={() => {
              router.push("/signup");
            }}
            className=" w-full mx-auto bg-transparent border-2 border-primary text-primary hover:text-white rounded-xl"
            disabled={LoginAction.isPending}
          >
            Create new account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
