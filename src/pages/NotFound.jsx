import { Box, Button, Text } from "@chakra-ui/react"

import  { useHistory} from 'react-router-dom'

function NotFound() {
    const history = useHistory()

    return (
        <Box
            maxW={'7xl'} margin={'auto'}
        >

            <Box
                top={"calc(50% - (580px / 2))"}
                right={{
                    xl : "calc(50% - (400px / 2))",
                    base: "calc(50% - (300px / 2))"
                }}
                position="fixed"
                display={'block'}
                align={'center'}
            >
                <Button
                    color={'white'}
                    bg={'#AA4A30'}
                    _hover={{
                    bg: 'yellow.500',
                    }}
                    onClick={e => {
                        history.push("/")
                    }}
                >Back Home</Button>


                <Box
                    w={{
                        xl :'400px',
                        sm: "300px",
                        base : '300px'
                    
                    }}
                    h={'140px'}
                    bg={'yellow.500'}
                    borderRadius={'15px'}
                >
                    <Box
                        mt={4}
                        pt={10}
                    >

                        <Text>404 Page Not Found</Text>
                        <Text>Mohon masukkan alamat url yang benar</Text>
                    </Box>
                    
                </Box>
            </Box>



        </Box>
    )
}

export { NotFound }