import { Box, Spinner } from "@chakra-ui/react"



function Loading() {
    return (
        <Box
        style={{
            position: "absolute",
            top: 0,
            width: "100vw",
            height: "100vh",
            zIndex: "10",
            backgroundColor: "rgb(0,0,0,0.2"
        }}
    >
        <Spinner 
            top="calc(50% - (58px / 2))" 
            right="calc(50% - (58px / 2))"
            position="fixed"
            display={'block'}
            zIndex="11"
        />
    </Box>
    )
}

export { Loading }