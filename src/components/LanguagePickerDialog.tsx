import { Box, Button, DialogActions } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { resources } from "../i18n";
import MaterialSymbolIcon from "./MaterialSymbolIcon";

const LANGUAGE_COUNTRY_MAPPING: Record<string, string> = {
  "en-US": "US",
  "en-GB": "GB",
  en: "US",
  ja: "JP",
  ko: "KR",
  "zh-Hans": "CN",
  "zh-Hant": "TW",
};

export interface LanguagePickerDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
}

interface LanguageInfo {
  code: string;
  currentLocaleName: string;
  localizedName: string;
}

export default function LanguagePickerDialog({
  onClose,
  open,
}: LanguagePickerDialogProps) {
  const { i18n, t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const languageInfos: LanguageInfo[] = useMemo(() => {
    const currentLanguage = new Intl.DisplayNames([i18n.language], {
      type: "language",
    });
    return Object.keys(resources).map((language) => {
      const localizedLanguage = new Intl.DisplayNames([language], {
        type: "language",
      });
      return {
        code: language,
        currentLocaleName: currentLanguage.of(language) ?? "",
        localizedName: localizedLanguage.of(language) ?? "",
      };
    });
  }, [i18n.language]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      slotProps={{ paper: { sx: { minWidth: "300px" } } }}
    >
      <DialogTitle>{t("languageSelect")}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {languageInfos.map((language) => (
          <ListItem disableGutters key={language.code}>
            <ListItemButton
              onClick={() => handleListItemClick(language.code)}
              disableGutters
              sx={{ padding: "4px 8px 4px 8px !important" }}
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                borderRadius={4}
                flexGrow={1}
                padding="4px 8px 4px 8px"
                bgcolor={
                  i18n.language === language.code
                    ? "primaryContainer.main"
                    : undefined
                }
                color={
                  i18n.language === language.code
                    ? "primaryContainer.contrastText"
                    : undefined
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{ bgcolor: "primary.main" }}
                    src={
                      language.code in LANGUAGE_COUNTRY_MAPPING &&
                      i18n.language !== language.code
                        ? `//esm.sh/country-flag-icons@1/1x1/${
                            LANGUAGE_COUNTRY_MAPPING[language.code] ?? ""
                          }.${"svg"}` // Weird string interpolation to work around
                        : // VSCode syntax/parsing bug with file extensions?!
                          undefined
                    }
                  >
                    {i18n.language === language.code ? (
                      <MaterialSymbolIcon icon="check" />
                    ) : (
                      <MaterialSymbolIcon icon="language" />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={language.localizedName}
                  secondary={language.currentLocaleName}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={handleClose}>{t("common.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}
