import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Color from "color";
import { FunctionComponent, PropsWithChildren } from "react";

type MacOSWindowProps = PropsWithChildren<{
  title?: string;
  shadow?: boolean;
}>;

const MacOSWindow: FunctionComponent<MacOSWindowProps> = ({
  children,
  title,
  shadow = true,
}) => {
  return (
    <Paper
      sx={{
        position: "relative",
        overflow: "hidden",
        borderColor: ({ palette }) => palette.grey[300],
        borderWidth: 1,
        borderStyle: "solid",
        boxShadow: shadow ? undefined : "none",
      }}
    >
      <Box
        component="div"
        sx={(theme) => ({
          left: 3,
          top: 6,
          position: "absolute",
          [theme.breakpoints.down("sm")]: {
            top: 0,
            left: 2,
          },
          "& span": {
            display: "inline-block",
            width: 12,
            height: 12,
            borderRadius: "50%",
            borderWidth: 1,
            borderStyle: "solid",
            marginLeft: "9px",
            "&:nth-child(1)": {
              backgroundColor: "rgb(238, 107, 96)",
              borderColor: Color("rgb(238, 107, 96)")
                .darken(0.1)
                .rgb()
                .string(),
            },
            "&:nth-child(2)": {
              backgroundColor: "rgb(246, 190, 80)",
              borderColor: Color("rgb(246, 190, 80)")
                .darken(0.1)
                .rgb()
                .string(),
            },
            "&:nth-child(3)": {
              backgroundColor: "rgb(98, 196, 84)",
              borderColor: Color("rgb(98, 196, 84)").darken(0.1).rgb().string(),
            },
            [theme.breakpoints.down("sm")]: {
              marginLeft: 6,
              width: 10,
              height: 10,
            },
          },
        })}
      >
        <span />
        <span />
        <span />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        sx={(theme) => ({
          height: 30,
          borderBottomColor: theme.palette.grey[300],
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          [theme.breakpoints.down("sm")]: {
            height: 20,
          },
        })}
      >
        {title && (
          <Typography
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                fontSize: 14,
              },
            })}
            variant="h6"
          >
            {title}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          overflow: "hidden",
          marginBottom: -5,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default MacOSWindow;
