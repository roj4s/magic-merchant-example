import { Box } from "@mui/system";
import { Input } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/joy";
import { useState } from "react";

export default function SearchInput({
  onSearch = () => {},
  placeholder = "Search...",
}) {
  const [searchCriteria, setSearchCriteria] = useState("");

  const changeHandler = (evt) => {
    const value = evt.target.value;
    setSearchCriteria(value);
    onSearch(value);
  };

  return (
    <Box>
      <Input
        sx={{ borderRadius: 20 }}
        value={searchCriteria}
        onChange={changeHandler}
        startDecorator={<SearchIcon />}
        placeholder={placeholder}
        endDecorator={
          searchCriteria && (
            <Button
              variant="text"
              size="xs"
              onClick={() => changeHandler({ target: { value: "" } })}
            >
              <CloseIcon />
            </Button>
          )
        }
      />
    </Box>
  );
}
