import React, { useState, VoidFunctionComponent } from "react";
import Link from "next/link";
import Color from "color";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { Theme } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { CodeProject, PreviewItem } from "../../app/work/code/code";
import { WORK_VARIANT_PALETTE } from "../../app/work/work";
import CodeProjectRepositories from "./CodeProjectRepositories";
import CodeProjectRelated from "./CodeProjectRelated";
import CodeProjectPreview from "./CodeProjectPreview";

const useCodePreviewsCarouselStyles = makeStyles<Theme>((theme) => ({
  carousel: {
    marginTop: theme.spacing(2),
  },
  arrowIconButton: {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 12px)",
    cursor: "pointer",
  },
  previewWrapper: {
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  },
}));

type CodePreviewsCarouselProps = {
  codeProjectSlug: string;
  previews: PreviewItem[];
};

const CodePreviewsCarousel: VoidFunctionComponent<
  CodePreviewsCarouselProps
> = ({ codeProjectSlug, previews }) => {
  const classes = useCodePreviewsCarouselStyles();

  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [autoIncrement, setAutoIncrement] = useState<boolean>(true);

  const handleChange = (i: number) => {
    setAutoIncrement(false);
    setSelectedItem(i);
  };

  return previews.length > 1 ? (
    <Carousel
      selectedItem={selectedItem}
      onChange={handleChange}
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      className={classes.carousel}
      labels={{ leftArrow: "previous", rightArrow: "next", item: "preview" }}
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <IconButton
            onClick={onClickHandler}
            title={label}
            className={classes.arrowIconButton}
            style={{ right: 0 }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )
      }
      renderArrowPrev={(onClickHandler, hasNext, label) =>
        hasNext && (
          <IconButton
            onClick={onClickHandler}
            title={label}
            className={classes.arrowIconButton}
            style={{ left: 0, transform: "scale(-1)" }}
          >
            <ArrowForwardIosIcon style={{ position: "relative", left: 2 }} />
          </IconButton>
        )
      }
    >
      {previews.map((preview, i) => (
        <Box key={preview.fileName} className={classes.previewWrapper}>
          <CodeProjectPreview
            shadow={false}
            displayCaption={false}
            codeProjectSlug={codeProjectSlug}
            preview={preview}
            onVideoEnded={() => {
              if (autoIncrement) {
                if (selectedItem === i) {
                  setSelectedItem((prev) =>
                    prev === previews.length - 1 ? 0 : prev + 1
                  );
                }
              } else {
                setAutoIncrement(true);
              }
            }}
          />
        </Box>
      ))}
    </Carousel>
  ) : (
    <Box className={classes.previewWrapper} mt={2}>
      <CodeProjectPreview
        shadow={false}
        displayCaption={false}
        codeProjectSlug={codeProjectSlug}
        preview={previews[0]}
      />
    </Box>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  cardRoot: {
    "&:not(:last-child)": {
      marginBottom: theme.spacing(4),
      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(2),
      },
    },
  },
  blurb: {
    marginTop: theme.spacing(1),
  },
  buttonWrapper: {
    "& a": {
      marginLeft: theme.spacing(1),
    },
  },
  moreButtonRoot: {
    borderColor: WORK_VARIANT_PALETTE.code,
    color: WORK_VARIANT_PALETTE.code,
    "&:hover": {
      backgroundColor: Color(WORK_VARIANT_PALETTE.code)
        .lighten(0.9)
        .fade(0.8)
        .hex(),
      "& $moreButtonEndIcon": {
        left: 3,
      },
    },
  },
  moreButtonEndIcon: {
    position: "relative",
    transition: theme.transitions.create("left"),
    left: 0,
    "& > *:first-child": {
      fontSize: 16,
    },
  },
}));

type CodeProjectCardProps = {
  project: CodeProject;
};

const CodeProjectCard: VoidFunctionComponent<CodeProjectCardProps> = ({
  project,
}) => {
  const classes = useStyles();

  return (
    <Card classes={{ root: classes.cardRoot }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">
            <strong>{project.name}</strong>
          </Typography>
          <Box display="flex" className={classes.buttonWrapper}>
            {project.url && (
              <a href={project.url} rel="noopener noreferrer" target="_blank">
                <Button variant="outlined">Visit</Button>
              </a>
            )}
            <Link href={`/work/code/${project.slug}`}>
              <Button
                classes={{
                  root: classes.moreButtonRoot,
                  endIcon: classes.moreButtonEndIcon,
                }}
                variant="outlined"
                endIcon={<ArrowForwardIosIcon />}
              >
                More
              </Button>
            </Link>
          </Box>
        </Box>
        {project.blurb && (
          <Typography className={classes.blurb}>{project.blurb}</Typography>
        )}
        {project.previews && project.previews.length > 0 && (
          <CodePreviewsCarousel
            codeProjectSlug={project.slug}
            previews={project.previews}
          />
        )}
        {project.repositories && project.repositories.length > 0 && (
          <CodeProjectRepositories repositories={project.repositories} />
        )}
        {project.related && project.related.length > 0 && (
          <CodeProjectRelated related={project.related} />
        )}
      </CardContent>
    </Card>
  );
};

export default CodeProjectCard;
