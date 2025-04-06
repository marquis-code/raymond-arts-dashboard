import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const credential = {
  firstName: ref(""),
  lastName: ref(""),
  email: ref(""),
  role: ref(""),
  password: ref(""),
};

export const use_auth_signup = () => {
  const router = useRouter();
  const loading = ref(false);

  const isFormDisabled = computed(() => {
    return (
      loading.value || 
      !credential.firstName.value ||
      !credential.lastName.value || 
      !credential.password.value ||  
      !credential.email.value || 
      !credential.role.value
    );
  });

  const signup = async (payload: {firstName: Record<string, any>, lastName: Record<string, any>, email: Record<string, any>, password: Record<string, any>, role: Record<string, any>}) => {
    loading.value = true;
    const res = (await auth_api.$_signup({
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
      password: payload.password,
    })) as any;
    if (res.type !== "ERROR") {
      showToast({
        title: "Success",
        message: 'Signup was successfully',
        toastType: "success",
        duration: 3000
      });
      return res.data
    } else {
      console.log(res, 'tes here')
      showToast({
        title: "Error",
        message: res?.data?.error  || "Something went wrong",
        toastType: "error",
        duration: 3000
      });
    }
  };
  return { credential, signup, loading, isFormDisabled };
};
