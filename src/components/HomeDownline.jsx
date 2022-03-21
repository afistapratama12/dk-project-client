import { Box, Button, Flex, Text, chakra, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel} from "@chakra-ui/react"
import { useState } from "react";

import { Link } from 'react-router-dom'

import { FaPlusCircle } from "react-icons/fa";
import { axiosPost } from "../API/axios";
import { positionInd } from "../helper/helper";

import swal from 'sweetalert';
import { PartCardHead } from "./donwline/PartCardHead";
import { PartCardMember } from "./donwline/PartCardMember";

const CFaPlusCircle = chakra(FaPlusCircle);

const auth = localStorage.getItem("access_token")

const baseId = localStorage.getItem("base_id")
const userId = localStorage.getItem("id")

// statusCard = 'head' | 'empty' | 'member'
export function Card({ data, statusCard, position, parentId, loading }) {

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [registerData, setRegisterData] = useState({
        fullname: "",
        phone_number: "",
        parent_id: +parentId,
        position: position
    })

    const handleCreateUser = (e) => {
        // pop up modal register user
        e.preventDefault()
        onOpen()
    }

    const handleRegisterData = (e, key) => {
        e.preventDefault()
        if (key === 'fullname') setRegisterData({ ...registerData, fullname: e.target.value})
        if (key === 'phone_number') setRegisterData({ ...registerData, phone_number: e.target.value})
    }

    const postCrateUser = async (e) => {
        e.preventDefault()

        try {
            const resp = await axiosPost(auth, `/v1/users/register`, registerData)
            
            if (resp.status === 201) {
                // register berhasil
                onClose()

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
        }
    } 

    return (
        <>
        <Box
            borderRadius={'15px'}
            bg="#F2F0F0"
            pt={2}
            width={{ md: '180px', base: '100%' }}
        >
            <Box
                align={'center'}
            >
                <Text fontWeight={'bold'} isTruncated={true}>{statusCard === 'empty' ? "..." : data?.fullname}</Text>
                <Text fontWeight={'bold'}>{data?.role === "admin" ? "Tengah" : positionInd(position)}</Text>
            </Box>

            {  statusCard === 'head' &&  (<PartCardHead data={data} isLoading={loading}/>)}

            { statusCard === 'empty' && (
                <Box
                    borderRadius={15}
                    bg='#E8E8E8'
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
                                size={56}
                            />
                        </Box>
                        <Button
                            pl={2}
                            pr={2}
                            borderRadius={15}
                            onClick={handleCreateUser}
                        >Daftarkan Orang</Button>
                    </Box>
                </Box>)
            }

            { statusCard === 'member' && (<PartCardMember isLoading={loading} toId={data.id}/>)}
        </Box>


        {/* for modal */}

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader>Daftarkan Orang</ModalHeader>
          <ModalCloseButton />

          <Box
            pl={6}
            pr={6}
          >
            <FormLabel>Nama Lengkap</FormLabel>
            <Input
                onChange={e => handleRegisterData(e, 'fullname')}
                value={registerData.fullname}
            />
            <FormLabel>No Telepon / WA</FormLabel>
            <Input
                onChange={e => handleRegisterData(e, 'phone_number')}
                value={registerData.phone_number}
            />
            <Box
                pt={4}
                align={'center'}
            >
                <Button 
                    fontWeight={'bold'}
                    onClick={postCrateUser}
                >Daftarkan</Button>
            </Box>
          </Box>
          
          <ModalFooter>
            <Button colorScheme='pink' mr={3} onClick={onClose}>
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
            backgroundColor="gray.50"
        >
            <Box>
                <Link to="/withdraw"><Button>Ajukan Penarikan</Button></Link>
            </Box>

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
                    <Button onClick={handlePrev}>Kembali Keatas</Button> : 
                    <>
                    <br/>
                    <br/>
                    </>
                    }
                </Box>

                <Card data={user} position={user?.position} statusCard={baseId !== userId ? 'member' : 'head'} loading={isLoading}/>
                <Flex
                    mt={6}
                    justifyContent={'space-around'}
                >
                    <Box>
                        <Card data={downline?.left} position={"left"} statusCard={downline.left === null ? 'empty' : 'member'} parentId={user?.id} loading={isLoading}/>
                        <Box
                            mt={4}    
                        >
                            { showMore?.left && <Button onClick={e => handleSeeDownline(e, downline.left)}>Lihat Downline</Button> }
                        </Box>
                    </Box>
                    <Box>
                        <Card data={downline?.center} position={'center'} statusCard={downline.center === null ? 'empty' : 'member'} parentId={user?.id} loading={isLoading}/>
                        <Box
                            mt={4}    
                        >
                            { showMore?.center && <Button onClick={e => handleSeeDownline(e, downline.center)}>Lihat Downline</Button> }
                        </Box>
                    </Box>
                    <Box>
                        <Card data={downline?.right} position={'right'} statusCard={downline?.right === null ? 'empty' : 'member'} parentId={user?.id} loading={isLoading}/>
                        <Box
                            mt={4}    
                        >
                            { showMore?.right && <Button onClick={e => handleSeeDownline(e, downline?.right)}>Lihat Downline</Button> }
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
        </>
    )

}


export { HomeDownline }