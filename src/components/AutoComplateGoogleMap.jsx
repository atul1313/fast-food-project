import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { FormControl } from '@mui/material';


function loadScript(src, position, id) {
    if (!position) {
        return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
}

const AutoComplateGoogleMap = ({ setAddress }) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [error, setError] = useState(false); // State to manage error
    const [submissionError, setSubmissionError] = useState(false); // State to manage submission error
    const loaded = useRef(false);
    const autocompleteService = useRef(null);

    const fetch = useMemo(
        () =>
            throttle((request, callback) => {
                autocompleteService.current.getPlacePredictions(request, callback);
            }, 200),
        []
    );

    const GOOGLE_MAPS_API_KEY = "AIzaSyBVNKPywiKIxMm9pXEu9MI6_FYThIyUpbg";

    useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === "") {
            setOptions([]);
            return undefined;
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                setOptions(results || []);
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, fetch]);

    useEffect(() => {
        if (typeof window !== "undefined" && !loaded.current) {
            if (!document.querySelector("#google-maps")) {
                loadScript(
                    `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
                    document.querySelector("head"),
                    "google-maps"
                );
            }

            loaded.current = true;
        }
    }, [GOOGLE_MAPS_API_KEY]);

    const handleAddressChange = (event, newAddress) => {
        if (!newAddress) {
            setError(true);
            return;
        }
        setError(false);
        if (setAddress) {
            setAddress(newAddress);
        }
    };

    const handleSubmit = () => {
        if (!inputValue) {
            setSubmissionError(true);
            return;
        }
    };

    return (
            <FormControl
                sx={{
                    minWidth: 120,
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#5e35b1'
                        },
                        '&:hover fieldset': {
                            borderColor: '#5e35b1'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#5e35b1',
                            borderWidth: '2px'
                        }
                    },
                    size: 'small',
                    margin:'0'
                }}
            >
                <Autocomplete
                    id="google-map-demo"
                    fullWidth
                    style={{ backgroundColor: '#fff', borderRadius: '4px'}}
                    getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.description
                    }
                    filterOptions={(x) => x}
                    options={options}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    onChange={handleAddressChange}
                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                    isOptionEqualToValue={(option, value) =>
                        option.description === value.description
                    }
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Add a location"
                        fullWidth
                        InputLabelProps={{ style: { color: '#5e35b1' } }}
                        color="secondary"
                        focused
                        size="small"
                        error={error || submissionError}
                        helperText={(error || submissionError) && "Address cannot be empty"}
                    />
                    )}
                    renderOption={(props, option) => {
                        const matches = option.structured_formatting.main_text_matched_substrings;
                        const parts = parse(
                            option.structured_formatting.main_text,
                            matches.map((match) => [match.offset, match.offset + match.length])
                        );

                        return (
                            <li {...props}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <LocationOnIcon sx={{ color: "text.secondary" }} />
                                    </Grid>
                                    <Grid item xs>
                                        {parts.map((part, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    fontWeight: part.highlight ? 700 : 400,
                                                }}
                                            >
                                                {part.text}
                                            </span>
                                        ))}
                                        <Typography variant="body2" color="text.secondary">
                                            {option.structured_formatting.secondary_text}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    }}
                />
            </FormControl>
    );
}

export default AutoComplateGoogleMap;
