import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateStudent } from "../../redux/slice/studentSlice";
import {
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { validatePhoneNumber } from "../../utility";

let idValue = 0;

const uniqueIdGenerator = () => {
  idValue += 1;
  return idValue;
};

const idReducer = () => {
  idValue -= 1;
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  idValue = useSelector((state: RootState) => state.student.students).reduce(
    (maxId, obj) => Math.max(maxId, obj.id),
    0
  );
  const currentRows = useSelector((state: RootState) => state.student.students);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 400px)");
  const { setRowModesModel } = props;

  const handleClick = () => {
    const id = uniqueIdGenerator();
    dispatch(
      updateStudent([
        {
          id,
          name: "",
          gender: "",
          address: "",
          mobileno: "",
          dateofbirth: dayjs(new Date()),
          age: "",
          isNew: true,
        },
        ...currentRows,
      ])
    );
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Typography
        padding="12px"
        sx={{ fontSize: "24px", fontWeight: 400, fontFamily: "Roboto" }}
      >
        User Profile
      </Typography>

      <Grid
        container={isMobile ? false : true}
        justifyContent="flex-end"
        alignItems="flex-end"
        padding="12px"
      >
        <Grid item>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={handleClick}
          >
            Add New
          </Button>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

const DataGridTable = () => {
  const initialRows: GridRowsProp = useSelector(
    (state: RootState) => state.student.students
  );
  const dispatch = useDispatch();

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    dispatch(updateStudent(initialRows.filter((row) => row.id !== id)));
    idReducer();
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = initialRows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      dispatch(updateStudent(initialRows.filter((row) => row.id !== id)));
    }
    idReducer();
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    const isPhoneNumberValid = validatePhoneNumber(newRow.mobileno);

    const isAgeValid = newRow.age > 18;

    if (!isPhoneNumberValid || !isAgeValid) {
      return {};
    }

    dispatch(
      updateStudent(
        initialRows.map((row) => (row.id === newRow.id ? updatedRow : row))
      )
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      type: "number",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      width: 80,
      sortable: false,
      valueFormatter: (params) => {
        const id = Number(params.value);
        const formattedId = id.toString().padStart(2, "0");
        return formattedId;
      },
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      width: 100,
      sortable: true,
      editable: true,

      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          onChange={(e) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            });
          }}
          sx={{
            boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(33, 150, 243, 1)",
            borderRadius: "5px",
          }}
        />
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      type: "singleSelect",
      valueOptions: ["male", "Female", "Other"],
      width: 120,
      sortable: false,
      editable: true,
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <Select
          size="small"
          fullWidth
          value={params.value as string}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          sx={{
            boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(33, 150, 243, 1)",
            borderRadius: "5px",
          }}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
          <MenuItem value={"Other"}>Other</MenuItem>
        </Select>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      width: 150,
      sortable: false,
      editable: true,
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          sx={{
            boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(33, 150, 243, 1)",
            borderRadius: "5px",
          }}
        />
      ),
    },
    {
      field: "mobileno",
      headerName: "Mobile No:",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
      editable: true,
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          onChange={(e) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            });
          }}
          sx={{
            boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(33, 150, 243, 1)",
            borderRadius: "5px",
          }}
        />
      ),
    },
    {
      field: "dateofbirth",
      headerName: "Date of Birth",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      type: "date",
      valueFormatter: (params) => {
        const date = dayjs(new Date(params.value));
        return date.format("ddd MMM DD YYYY");
      },
      sortable: true,
      editable: true,
      width: 205,
      renderEditCell: (
        params: GridRenderCellParams<any, dayjs.Dayjs | null>
      ) => {
        const dateValue = params.value ? dayjs(params.value) : null;
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{ paddingTop: "0px" }}
            >
              <DatePicker
                value={dateValue}
                onChange={(newValue) =>
                  params.api.setEditCellValue({
                    id: params.id,
                    field: params.field,
                    value: newValue,
                  })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(33, 150, 243, 1)",
                      borderRadius: "5px",
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        );
      },
    },
    {
      field: "age",
      headerName: "Age",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      type: "number",
      editable: true,
      sortable: false,
      width: 80,

      valueGetter: ({ row }) => {
        try {
          const dateOfBirth = new Date(row.dateofbirth);

          const today = new Date();
          const age =
            today.getFullYear() -
            dateOfBirth.getFullYear() -
            (today.getMonth() < dateOfBirth.getMonth() ||
            (today.getMonth() === dateOfBirth.getMonth() &&
              today.getDate() < dateOfBirth.getDate())
              ? 1
              : 0);
          return age;
        } catch (error) {
          return 0;
        }
      },
    },
    {
      field: "actions",
      type: "actions",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",

      headerName: "Actions",
      width: 215,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Stack direction="column" spacing={1} paddingY="10px">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleSaveClick(id)}
                sx={{ width: "30px", fontSize: "13px", fontWeight: 500 }}
              >
                Add
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleCancelClick(id)}
                sx={{
                  width: "150px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                Discard Changes
              </Button>
            </Stack>,
          ];
        }

        return [
          <Stack direction="row" spacing={3}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleEditClick(id)}
              sx={{ fontSize: "13px", fontWeight: 500 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleDeleteClick(id)}
              sx={{ fontSize: "13px", fontWeight: 500 }}
            >
              Remove
            </Button>
          </Stack>,
        ];
      },
    },
  ];

  return (
    <Container>
      <Paper
        sx={{
          height: "auto",
          width: "100%",
          "& .super-app-theme--header": {
            backgroundColor: "rgba(33, 150, 243, 0.08)",
          },
        }}
      >
        <DataGrid
          rows={initialRows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRowModesModel },
          }}
        />
      </Paper>
    </Container>
  );
};

export default DataGridTable;
