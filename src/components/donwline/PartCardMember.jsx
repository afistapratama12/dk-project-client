import { 
    Box, Button, Skeleton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel
} from "@chakra-ui/react"
import { useState } from "react"
import swal from "sweetalert"
import { axiosPost } from "../../API/axios"

const userId = localStorage.getItem("id")
const auth = localStorage.getItem("access_token")

function PartCardMember({isLoading, toId}) {
    const { isOpen, onOpen, onClose} = useDisclosure()

    const [openModal, setOpenModal] = useState({
        money: false,
        SAS: false,
        RO: false
    })

    const [sendData, setSendData] = useState(null)

    const handleSendData = (e, balanceName) => {
        e.preventDefault()

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

        try {
            const postData = {from_id: +userId, to_id: +toId}

            if (openModal.money) {
                postData["money_balance"] = +sendData.money_balance
            }
    
            if (openModal.SAS) {
                postData["sas_balance"] = +sendData.sas_balance
            }
    
            if (openModal.RO) {
                postData["ro_balance"] = +sendData.ro_balance
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
        }
    }

 return(
     <>
     <Skeleton isLoaded={isLoading? false : true}>
        <Box
            borderRadius={15}
            bg='#E8E8E8'
            pt={2}
            pb={2}
            pl={4}
            pr={4}
            align={'center'}
        >
            <Button onClick={() => {
                setOpenModal({ SAS: false, RO: false, money: true})
                onOpen()
            }}
                borderRadius={15}
            >
                Kirim Uang
            </Button>
            <Button onClick={() => {
                setOpenModal({ SAS: true, money: false, RO: false})
                onOpen()
            }}
                borderRadius={15}
            >
                Kirim SAS
            </Button>
            <Button
                onClick={() => {
                    setOpenModal({RO: true, money: false, SAS: false})
                    onOpen()
                }}
                borderRadius={15}
            >
                Kirim RO
            </Button>
        </Box>
    </Skeleton>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader>Kirim Saldo</ModalHeader>
          <ModalCloseButton />

          <Box
            pl={6}
            pr={6}
          >

            { openModal.money && (
                    <>
                    <FormLabel>Kirim Saldo Uang</FormLabel>
                    <Input
                        type='number'
                        onChange={e => handleSendData(e, "money_balance")}
                        value={sendData?.money_balance}
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
                >Kirim</Button>
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

export { PartCardMember }