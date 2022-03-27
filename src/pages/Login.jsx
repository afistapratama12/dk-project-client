import { 
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    Avatar,
    FormControl,
    FormHelperText,
    InputRightElement,
    Spinner,
    Text
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { Axios } from "../API/axios";

import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import swal from "sweetalert";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

function Login() {
    const history  = useHistory()

    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errMesage, setErrMessage] = useState("");

    const handleShowClick = () => setShowPassword(!showPassword);

    const handleChangeLogin = (e, data) => {
        e.preventDefault()

        let newData
        switch (data) {
            case "username":
                newData = { ...loginData, username: e.target.value}
                setLoginData(newData)
                break;
            case "password":
                newData = { ...loginData, password: e.target.value}
                setLoginData(newData)
                break;
            default:
                break
        }
    }

    const submitLogin = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        try {
            const response  = await Axios({
                method: "POST",
                url: "/v1/users/login",
                data: loginData
            })
    
            if (response.data?.auth_token) { 
                localStorage.setItem("id", response.data?.id)
                localStorage.setItem("role", response.data?.role)
                localStorage.setItem("parent_id", response.data?.parent_id)
                localStorage.setItem("fullname", response.data?.fullname)
                localStorage.setItem("access_token", response.data.auth_token)
                localStorage.setItem("base_id", response.data?.id) // for showing the base downline list
    
                setIsError(false)

              if ( response.data?.role === 'admin') {
                history.push({
                  pathname: "/admin"
                })
              } else if (response.data?.role === "user") {
                history.push({
                  pathname: "/"
                })
              }
            }            
        } catch (err) {
            if (err.response?.status === 500) {
                setErrMessage("Username dan PIN tidak terdaftar, mohon coba lagi")
            } else if (err.response?.status === 400) {
                setErrMessage("Mohon masukkan username dan PIN")
            }

            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgot= (e) => {
      e.preventDefault()

      swal({          
        title: "Lupa akun!",
        text: `Mohon hubungi admin untuk mendapatkan informasi login`,
        icon: "warning",
      })
    }

    return (
    <>
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              {
                  isError && (
                  <Box
                    borderRadius={'10px'}
                    color='pink'
                  >
                     <Text>{errMesage}</Text>
                  </Box>)
              }
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input 
                    type="text"
                    placeholder="Username"
                    onChange={e => handleChangeLogin(e, "username")}
                    value={loginData.username}  
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="PIN / Password"
                    onChange={e => handleChangeLogin(e, "password")}
                    value={loginData.password}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link onClick={handleForgot}>lupa akun?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={submitLogin}
              >
                { isLoading ? <Spinner/> : "Login"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
    </>
    )

}

export { Login };
