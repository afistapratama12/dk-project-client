import { Box, Button, Flex, Text, chakra, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel, Spinner} from "@chakra-ui/react"
import { useState } from "react";

import { FaPlusCircle } from "react-icons/fa";
import { axiosPost } from "../API/axios";
import { positionInd } from "../helper/helper";

import swal from 'sweetalert';
import { PartCardHead } from "./donwline/PartCardHead";
import { PartCardMember } from "./donwline/PartCardMember";
import { buttonResponsive, fontDlResp } from "../theme/font";

const CFaPlusCircle = chakra(FaPlusCircle);

const auth = localStorage.getItem("access_token")

const baseId = localStorage.getItem("base_id")
const userId = localStorage.getItem("id")

// statusCard = 'head' | 'empty' | 'member'
export function Card({ data, statusCard, position, parentId, loading }) {
    const { isOpen, onOpen, onClose} = useDisclosure()

    const [loadingCreate, setLoadingCreate] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const [registerData, setRegisterData] = useState({
        fullname: "",
        phone_number: "",
        parent_id: 0,
        position: position
    })

    const handleCreateUser = (e) => {
        // pop up modal register user
        e.preventDefault()
        onOpen()
        setRegisterData({...registerData, parent_id : +parentId})
    }

    const handleClose = () => {
        setErrorMessage(null)
        onClose()
    }

    const postCrateUser = async (e) => {
        e.preventDefault()

        if (registerData.fullname === "") {
            setErrorMessage("mohon isi nama lengkap")
        } else if (registerData.phone_number === "") {
            setErrorMessage("mohon masukkan nomer HP / WA")
        } else if (registerData.phone_number.length < 11 || registerData.phone_number.slice(0,2) !== "08") {
            setErrorMessage("mohon masukan nomer yang benar")
        } else {
            setLoadingCreate(true)

            try {
                const resp = await axiosPost(auth, `/v1/users/register`, registerData)
                
                if (resp.status === 201) {
                    // register berhasil
                    onClose()
                    setErrorMessage(null)

                    swal({
                        title: "Berhasil!",
                        text: `Downline anda berhasil di daftarkan, nama : ${registerData.fullname}`,
                        icon: "success",
                        timer: 1500,
                        buttons: false,
                    }).then(function() {
                        window.location.reload(true)
                    })
                }
            } catch (err) {
                console.log(err.response)

                if(err?.response?.status === 500) {
                    if (err.response?.data?.errors === "unsufficient sas balance (balance tidak cukup)") {
                        setErrorMessage("Saldo SAS tidak mencukupi")
                    }
                }
            } finally {
                setLoadingCreate(false)
            }
        }
    } 

    return (
        <>
        <Box
            borderRadius={'15px'}
            bg="#F2F0F0"
            pt={2}
            width={{
                xl : "180px",
                sm: "170px",
                base: "125px"
            }}
        >
            <Box
                align={'center'}
                fontSize={fontDlResp}
                // bg={'#ffa07a'}
            >
                <Text fontWeight={'bold'} isTruncated={true}>{statusCard === 'empty' ? "..." : data?.fullname.split(" ")[0]}</Text>
                <Text fontWeight={'bold'}>{data?.role === "admin" ? "Tengah" : positionInd(position)}</Text>
            </Box>

            {  statusCard === 'head' &&  (<PartCardHead data={data} isLoading={loading}/>)}

            { statusCard === 'empty' && (
                <Box
                    borderRadius={15}
                    pt={2}
                    pb={2}
                    pl={4}
                    pr={4}
                    cursor={'pointer'}
                    onClick={handleCreateUser}
                >
                    <Box
                        align={'center'}
                    >
                        <Box
                            pb={2}
                        >
                            <CFaPlusCircle 
                                mt={2}
                                mb={2}
                                size={53}
                            />
                        </Box>
                        <Button
                            pl={0}
                            pr={2}
                            borderRadius={15}
                            onClick={handleCreateUser}
                            fontSize={buttonResponsive}
                        >Daftarkan Orang</Button>
                    </Box>
                </Box>)
            }

            { statusCard === 'member' && (<PartCardMember isLoading={loading} toId={data.id}/>)}
        </Box>


        {/* for modal */}

        <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader>Daftarkan Orang</ModalHeader>
          <ModalCloseButton />

          <Box
            px={6}
          >
            
            {
                errorMessage && (
                <Box
                    bg='pink'
                    py={2}
                    pl={2}
                    mb={2}
                >
                    <Text>{errorMessage}</Text>
                </Box>
                )
            }

            <FormLabel>Nama Lengkap</FormLabel>
            <Input
                onChange={e => setRegisterData({ ...registerData, fullname: e.target.value})}
                value={registerData.fullname}
            />
            <FormLabel>No Telepon / WA</FormLabel>
            <Input
                onChange={e => setRegisterData({ ...registerData, phone_number: e.target.value})}
                value={registerData.phone_number}
            />
            <Box
                pt={4}
                align={'center'}
            >
                <Button 
                    width={'120px'}
                    fontWeight={'bold'}
                    onClick={postCrateUser}
                    disabled={loadingCreate ? true : false}
                >{loadingCreate ? <Spinner/> : "Daftarkan"}</Button>
            </Box>
          </Box>
          
          <ModalFooter>
            <Button bg={'yellow.700'} color={'gray.50'} mr={3} onClick={handleClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}


function HomeDownline(props) {
    const user = props.userDetail
    const downline = props.downline // { left: obj, center: obj, right: obj}
    const showMore = props.showMore
    const isLoading = props.isLoading

    const handleSeeDownline = (e, dl) => {
        e.preventDefault()

        localStorage.setItem("base_id", dl.id)

        // set Show Data using localStorage
        localStorage.setItem("show_id", dl.id)
        localStorage.setItem("show_fullname", dl.fullname)
        localStorage.setItem("show_position", dl.position)


        const prevId = localStorage.getItem("prev_id") ? JSON.parse(localStorage.getItem("prev_id")) : []

        prevId.push(user.id)

        localStorage.setItem("prev_id", JSON.stringify(prevId))

        window.location.reload(true)
    }

    const handlePrev = (e) => {
        e.preventDefault()
        
        const prevId = JSON.parse(localStorage.getItem("prev_id"))

        const popPrevId = prevId.pop()
        localStorage.setItem("base_id", popPrevId)
        localStorage.setItem("prev_id", JSON.stringify(prevId))

        window.location.reload(true)
    }

    return (
        <>
        <Box 
            maxW={'7xl'}
        >
            <Box
                align={'center'}
                p={2}
            >
                <Text fontWeight={'bold'}>Jaringan Anda</Text>
            </Box>

            <Box
                align="center"
            >   
                <Box
                    m={4}
                    pb={1}
                >
                    { baseId !== userId ? 
                    <Button 
                        onClick={handlePrev}
                        fontSize={buttonResponsive}   
                        bg={'#AA4A30'}
                        color={'white'} 
                    >Kembali Keatas</Button> : 
                    <Box
                        fontSize={{
                            xl: '18px',
                            md: '16px',
                            sm: '14px',
                            base: '14px'
                        }}
                        p={4}
                    >
                        <Text fontWeight={'bold'}>Paling Atas</Text>
                    </Box>
                    }
                </Box>

                <Flex justifyContent={'center'}>
                    <Card data={user} position={user?.position} statusCard={baseId !== userId ? 'member' : 'head'} loading={isLoading}/>
                </Flex>
               
                <Flex
                    mt={6}
                    justifyContent={'space-around'}
                >
                    <Box>
                        <Card data={downline?.left} position={"left"} statusCard={downline.left === null ? 'empty' : 'member'} parentId={user?.id} loading={isLoading}/>
                        <Box
                            mt={4}    
                        >
                            { showMore?.left && <Button 
                                onClick={e => handleSeeDownline(e, downline.left)}
                                fontSize={buttonResponsive}  
                                bg={'#AA4A30'}
                                color={'white'}  
                            >Lihat Downline</Button> }
                        </Box>
                    </Box>
                    <Box>
                        <Card data={downline?.center} position={'center'} statusCard={downline.center === null ? 'empty' : 'member'} parentId={user?.id} loading={isLoading}/>
                        <Box
                            mt={4}    
                        >
                            { showMore?.center && <Button 
                                onClick={e => handleSeeDownline(e, downline.center)}
                                fontSize={buttonResponsive}
                                bg={'#AA4A30'}
                                color={'white'}
                            >Lihat Downline</Button> }
                        </Box>
                    </Box>
                    <Box>
                        <Card data={downline?.right} position={'right'} statusCard={downline?.right === null ? 'empty' : 'member'} parentId={user?.id} loading={isLoading}/>
                        <Box
                            mt={4}    
                        >
                            { showMore?.right && <Button 
                                onClick={e => handleSeeDownline(e, downline?.right)}
                                fontSize={buttonResponsive}
                                bg={'#AA4A30'}
                                color={'white'}
                            >Lihat Downline</Button> }
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
        </>
    )

}


export { HomeDownline }