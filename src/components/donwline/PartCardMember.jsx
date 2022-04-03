import { 
    Box, Button, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel, Flex, Text, Spinner
} from "@chakra-ui/react"
import { useState } from "react"
import swal from "sweetalert"
import { axiosPost } from "../../API/axios"
import { buttonResponsive } from "../../theme/font"

function PartCardMember({userDetail, isLoading, toId}) {
    const userId = localStorage.getItem("id")
    const auth = localStorage.getItem("access_token")

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [openModal, setOpenModal] = useState({
        money: false,
        SAS: false,
        RO: false
    })

    const [sendData, setSendData] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [loadingSend, setLoadingSend] = useState(false)

    const handleSendData = (e, balanceName) => {
        e.preventDefault()
        if (loadingSend) {
            return
        }

        if (balanceName === 'sas_balance') { 
            setSendData({
                sas_balance: e.target.value
            })
        }

        if (balanceName === 'ro_balance') { 
            setSendData({
                ro_balance: e.target.value
            })
        }

        if (balanceName === 'money_balance') { 
            setSendData({
                money_balance: e.target.value
            })
        }
    }

    const postTransaction = async (e) => {
        e.preventDefault()
        setLoadingSend(true)

        try {
            const postData = {from_id: +userId, to_id: +toId}

            if (openModal.money) {
                if (+sendData.money_balance < 1000) {
                    setErrorMessage("mohon masukkan saldo minimal 1000 rupiah")
                    setLoadingSend(false)

                    return
                } else if ((+sendData.money_balance + 300) > userDetail?.money_balance ) {
                    setErrorMessage("Saldo tidak cukup, pastikan ada saldo untuk penarikan biaya admin")
                    setLoadingSend(false)

                    return
                } else {
                    postData["money_balance"] = (+sendData.money_balance + 300)
                    postData["category"] = "umum"
                    postData["description"] = userId === "1" ? "kirim saldo keuangan ke member" : "kirim saldo keuangan ke member lain"
                }
            }
            if (openModal.SAS) {
                postData["sas_balance"] = +sendData.sas_balance
                postData["category"] = "umum"
                postData["description"] = userId === "1" ? "kirim saldo SAS ke member" : "kirim saldo SAS ke member lain"
            }
    
            if (openModal.RO) {
                postData["ro_balance"] = +sendData.ro_balance
                postData["category"] = "umum"
                postData["description"] = userId === "1" ? "kirim saldo RO ke member" : "kirim saldo RO ke member lain"
            }
    
            const resp = await axiosPost(auth, `/v1/transaction/record`, postData) 

            if (resp.status === 201) {
                onClose()

                swal({
                    title: "Berhasil!",
                    text: `Saldo berhasi terkirim`,
                    icon: "success",
                    timer: 1500,
                    buttons: false,
                }).then(function() {
                    window.location.reload(true)
                })
            }
            
        } catch (err) {
            console.log(err.response)
            if (err?.response?.status === 500) {
                const errBalance = ["SASBalance", "ROBalance", "MoneyBalance"]
                const check = errBalance.some(el => err.response.data.message.includes(el))
                if (check) {
                    setErrorMessage("Saldo tidak cukup, pastikan ada saldo untuk penarikan biaya admin")
                }
            }
        } finally {
            setLoadingSend(false)
        }
    }

    const handleClose = (e) => {
        e.preventDefault()
        if (loadingSend) {
            return
        }

        onClose()
        setErrorMessage(null)

    }

 return(
     <>
        <Box
            borderRadius={15}
            bg='#E8E8E8'
            pt={2}
            pb={2}
            pl={4}
            pr={4}
            align={'center'}
        >
            <Flex direction={'column'}>
                <Button onClick={() => {
                    setOpenModal({ SAS: false, RO: false, money: true})
                    onOpen()
                }}
                    borderRadius={15}
                    fontSize={buttonResponsive}
                >
                    Kirim Uang
                </Button>
                <Button onClick={() => {
                    setOpenModal({ SAS: true, money: false, RO: false})
                    onOpen()
                }}
                    borderRadius={15}
                    fontSize={buttonResponsive}
                >
                    Kirim SAS
                </Button>
                <Button
                    onClick={() => {
                        setOpenModal({RO: true, money: false, SAS: false})
                        onOpen()
                    }}
                    borderRadius={15}
                    fontSize={buttonResponsive}
                >
                    Kirim RO
                </Button>
            </Flex>
        </Box>

        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent
            >
            <ModalHeader>Kirim Saldo</ModalHeader>
            <ModalCloseButton onClick={handleClose}/>

            <Box
                pl={6}
                pr={6}
            >

            <Box>
                {
                    errorMessage && <Text
                    mb={2}
                    fontWeight={'bold'}
                    color={'red'}
                    fontSize={{
                        xl : '18px',
                        md: '18px',
                        sm: '16px',
                        base:"14px"
                    }}
                    >{errorMessage}</Text>
                }
            </Box>

                { openModal.money && (
                        <>
                        <FormLabel>Kirim Saldo Uang</FormLabel>
                        <Input
                            type='number'
                            onChange={e => handleSendData(e, "money_balance")}
                            value={sendData?.money_balance}
                            placeholder={'misal: 1000'}
                        />
                        </>
                )}
                { openModal.SAS && (
                        <>
                        <FormLabel>Kirim Saldo SAS</FormLabel>
                        <Input
                            type='number'
                            onChange={e => handleSendData(e, "sas_balance")}
                            value={sendData?.sas_balance}
                            placeholder={'misal: 2'}
                        />
                        </>
                )}
                { openModal.RO && (
                        <>
                        <FormLabel>Kirim Saldo RO</FormLabel>
                        <Input
                            type='number'
                            onChange={e => handleSendData(e, "ro_balance")}
                            value={sendData?.ro_balance}
                            placeholder={'misal: 2'}
                        />
                        </>
                )}
                <Box
                    pt={4}
                    align={'center'}
                >
                    <Button 
                        fontWeight={'bold'}
                        onClick={postTransaction}
                        width={'90px'}
                    >{loadingSend ? <Spinner/> : "Kirim"}</Button>
                </Box>

                {
                    openModal.money && (
                        <Box mt={2}>
                        <Text
                            fontSize={{
                                xl : '14px',
                                md: "14px",
                                sm: "11px",
                                base: "11px"
                            }}
                        
                        >Catatan : setiap transaksi keuangan akan otomatis dipotong biaya admin sebesar 300 rupiah</Text>
                        <Text
                            fontSize={{
                                xl : '14px',
                                md: "14px",
                                sm: "11px",
                                base: "11px"
                            }}
                        
                        >Contoh : mengirim saldo keuangan Rp 2.000, maka akan mengurangi saldo Rp 2.300 </Text>
                    </Box>
                    )
                }

            </Box>
            <ModalFooter>
                <Button colorScheme='pink' mr={3} onClick={handleClose}>
                Batal
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
 )
}

export { PartCardMember }