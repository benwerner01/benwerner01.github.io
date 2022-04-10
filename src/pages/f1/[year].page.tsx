import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  Box,
  Button,
  styled,
  Container,
  Select,
  MenuItem,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  fetchSeasonRaceResults,
  fetchSeasonRaceResultsByDriver,
  fetchSeasonRaces,
  RaceDriverWithResultsAndConstructor,
  SeasonRaceResults,
  SeasonRaces,
} from "./shared/ergastF1Api";
import DriverRaceResultsLineGraph from "./shared/DriverRaceResultsLineGraph";
import { f1Color } from "./shared/util";
import Link from "next/link";
import { useRouter } from "next/router";

const F1RedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(f1Color),
  backgroundColor: f1Color,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: f1Color,
    boxShadow: "none",
  },
}));

type F1PageProps = {
  year: string;
  seasonRaceResults: SeasonRaceResults;
  seasonRaceResultsByDriver: RaceDriverWithResultsAndConstructor[];
  seasonRaces: SeasonRaces;
};

type ParsedQueryParams = { year: string };

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async () => {
  const currentYear = new Date().getFullYear();
  const yearsToRender = Array.from({ length: 10 }, (_, i) =>
    (currentYear - i).toString()
  );
  return {
    fallback: "blocking",
    paths: yearsToRender.map((year) => ({ params: { year } })),
  };
};

export const getStaticProps: GetStaticProps<
  F1PageProps,
  ParsedQueryParams
> = async ({ params }) => {
  const { year } = params;

  return {
    props: {
      year,
      seasonRaceResults: await fetchSeasonRaceResults({ year }),
      seasonRaceResultsByDriver: await fetchSeasonRaceResultsByDriver({ year }),
      seasonRaces: await fetchSeasonRaces({ year }),
    },
    revalidate: 100,
  };
};

const F1Page: NextPage<F1PageProps> = ({
  year,
  seasonRaceResults,
  seasonRaceResultsByDriver,
  seasonRaces,
}) => {
  const router = useRouter();

  const yearAsNumber = parseInt(year, 10);
  const currentYear = new Date().getFullYear();

  const possibleYears = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <Container sx={{ position: "relative" }}>
      <Box display="flex" position="relative" alignItems="stretch">
        <Link href={`/f1/${yearAsNumber - 1}`}>
          <a>
            <F1RedButton
              variant="contained"
              sx={{
                px: 1,
                height: "100%",
                minWidth: "unset",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              color="inherit"
            >
              <ChevronLeft />
            </F1RedButton>
          </a>
        </Link>
        <Box
          sx={{
            borderColor: f1Color,
            borderStyle: "solid",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderRadius: 0,
          }}
        >
          <Select
            value={year}
            onChange={({ target }) => router.push(`/f1/${target.value}`)}
            sx={{
              height: "100%",
              width: 75,
              position: "relative",
            }}
            inputProps={{
              sx: {
                py: 0.5,
                px: 1,
              },
            }}
            disableUnderline
            variant="standard"
          >
            {possibleYears.map((possibleYear) => (
              <MenuItem key={possibleYear} value={possibleYear}>
                {possibleYear}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Link href={`/f1/${yearAsNumber + 1}`}>
          <a>
            <F1RedButton
              variant="contained"
              disabled={new Date().getFullYear() === yearAsNumber}
              sx={{
                px: 1,
                minWidth: "unset",
                height: "100%",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              color="inherit"
            >
              <ChevronRight />
            </F1RedButton>
          </a>
        </Link>
      </Box>
      <DriverRaceResultsLineGraph
        year={year}
        seasonRaceResultsByDriver={seasonRaceResultsByDriver}
        seasonRaces={seasonRaces}
      />
    </Container>
  );
};

export default F1Page;
