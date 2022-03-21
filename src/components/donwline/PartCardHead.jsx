import { 
    Box, Button, Flex, Skeleton, Text, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel
} from "@chakra-ui/react"
import { formatMoney } from "../../helper/helper"

function PartCardHead({ data, isLoading }) {
    const { isOpen, onOpen, onClose} = useDisclosure()
    
    const handleShowUser = (e) => {
        e.preventDefault()
        onOpen()
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
            >
                <Box
                    pb={2}
                >
                    <Flex
                        justifyContent={'space-between'}
                    >
                        <Text>Uang</Text>
                        <Text>{formatMoney(data?.money_balance)}</Text>
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
                        borderRadius={15}
                        onClick={handleShowUser}
                    >Info Lengkap</Button>
                </Box>
            </Box>
        </Skeleton>


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