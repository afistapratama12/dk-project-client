import React from "react";
import { Box } from "@chakra-ui/react";
import { textResponsive } from "../theme/font";

export const TableProps = ({ children, ...rest }) => {
  return (
    <Box
      table-layout="auto"
      border-collapse="collapse"
      style={{ tableLayout: "fixed", width: "100%" }}
      {...{ as: "table" }}
      {...rest}
    >
      {children}
    </Box>
  );
};
export const Thead = ({ children, ...rest }) => {
  return (
    <Box p={4} textAlign="left" {...{ as: "thead" }} {...rest}>
      {children}
    </Box>
  );
};

export const Tbody = ({ children, ...rest }) => {
  return (
    <Box p={4} {...{ as: "tbody" }} {...rest}>
      {children}
    </Box>
  );
};

export const Tfoot = ({ children, ...rest }) => {
  return (
    <Box p={4} {...{ as: "tfoot" }} {...rest}>
      {children}
    </Box>
  );
};

export const Th= ({ children, ...rest }) => {
  return (
    <Box
      p={2}
      borderBottom="1px"
      borderBottomColor="gray.200"
      fontSize={{
        base:"11px",
        xl: '18px'
        }}
      {...{ as: "th" }}
      {...rest}

    >
      {children}
    </Box>
  );
};

export const Tr= ({ children, ...rest }) => {
  return (
    <Box my={1} {...{ as: "tr" }} {...rest}>
      {children}
    </Box>
  );
};

export const Td = ({ children, ...rest }) => (
  <Box
    p={4}
    borderBottom="1px"
    borderBottomColor="gray.200"
    {...{ as: "td" }}
    {...rest}
    fontSize={{
        xl: '18px',
        base: "12px"
    }}
  >
    {children}
  </Box>
);