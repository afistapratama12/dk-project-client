import { 
    Box, Button, Flex, Text, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter
} from "@chakra-ui/react"
import { formatBigMoney, formatMoney } from "../../helper/helper"
import { buttonResponsive, fontDlResp } from "../../theme/font"

function PartCardHead({ data }) {
    const { isOpen, onOpen, onClose} = useDisclosure()
    
    const handleShowUser = (e) => {
        e.preventDefault()
        onOpen()
    }

    return(
        <>
            <Box
                borderRadius={15}
                bg='#ffecd4'
                pt={2}
                pb={2}
                pl={4}
                pr={4}
            >
                <Box
                    pb={2}
                    fontSize={fontDlResp}
                >
                    <Flex
                        justifyContent={'space-between'}
                    >
                        <Text>Uang</Text>
                        <Text>{formatBigMoney(data?.money_balance)}</Text>
                    </Flex>
                    <Flex
                        justifyContent={'space-between'}
                    >
                        <Text>Saldo SAS</Text>
                        <Text>{formatMoney(data?.sas_balance)}</Text>
                    </Flex>
                    <Flex
                        justifyContent={'space-between'}
                    >
                        <Text>Saldo RO</Text>
                        <Text>{formatMoney(data?.ro_balance)}</Text>
                    </Flex>
                </Box>
                <Box
                    align="center"
                >
                    <Button
                        ml={-1}
                        borderRadius={15}
                        onClick={handleShowUser}
                        fontSize={buttonResponsive}
                        bg={'#D57149'}
                        color={'white'}
                    >Info Lengkap</Button>
                </Box>
            </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader>Informasi Diri</ModalHeader>
          <ModalCloseButton />

          <Box
            pl={8}
            pr={10}
            fontSize='17px'
            lineHeight={2}
          >
            <Flex
                justifyContent={'space-between'}
            >
                <Text>Nama Lengkap : </Text>
                <Text>{data?.fullname}</Text>
            </Flex>
            <Flex
                justifyContent={'space-between'}
            >
                <Text>Nomer Telp / WA : </Text>
                <Text>{data?.phone_number}</Text>
            </Flex>
            <Flex
                justifyContent={'space-between'}
            >
                <Text>Username :</Text>
                <Text>{data?.username}</Text>
            </Flex>
            <Flex
                justifyContent={'space-between'}
            >
                <Text>Saldo Keuangan :</Text>
                <Text>{data?.money_balance}</Text>
            </Flex>
            <Flex
                justifyContent={'space-between'}
            >
                <Text>Saldo SAS :</Text>
                <Text>{data?.sas_balance}</Text>
            </Flex>
            <Flex
                justifyContent={'space-between'}
            >
                <Text>Saldo Repeat Order :</Text>
                <Text>{data?.ro_balance}</Text>
            </Flex>

          </Box>
          <ModalFooter>
            <Button colorScheme='pink' mr={3} onClick={onClose}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export { PartCardHead }