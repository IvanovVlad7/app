import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "@mui/material";

interface DashboardProps {
  currentUserId: string | null;
  onLogout: (prop: boolean, id: string) => void;
}

interface UserData {
  ID: number;
  status: "active" | "inactive";
  name: string;
  email: string;
  registration_date: string;
  last_login_date: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUserId, onLogout }: any) => {
  const [data, setData] = useState<UserData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/dashboard");
      const formattedData = response.data.map((user: UserData) => ({
        ...user,
        registration_date: formatDate(user.registration_date),
        last_login_date: formatDate(user.last_login_date)
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/dashboard/delete/${userId}`
      );
      if (response.status === 200 && userId === currentUserId) {
        onLogout(false)
      } else {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleChangeStatus = async (userId: number, newStatus: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/dashboard/update/${userId}`,
        { status: newStatus }
      );
      console.log(response.status);
      if (response.status === 200 && userId === currentUserId) {
        onLogout(false)
      } else {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((user) => user.ID);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (userId: number) => {
    const selectedIndex = selectedRows.indexOf(userId);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (userId: number) => selectedRows.indexOf(userId) !== -1;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Toolbar>
        <Typography variant="h6" component="div">
          Добро пожаловать!
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onLogout}
          style={{ marginLeft: "auto" }}
        >
          Выйти
        </Button>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < data.length
                  }
                  checked={
                    data.length > 0 &&
                    selectedRows.length === data.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Мыло</TableCell>
              <TableCell>Дата регистрации</TableCell>
              <TableCell>Дата последнего входа</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                const isUserSelected = isSelected(user.ID);
                return (
                  <TableRow
                    key={user.ID}
                    hover
                    role="checkbox"
                    aria-checked={isUserSelected}
                    tabIndex={-1}
                    selected={isUserSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isUserSelected}
                        onClick={() => handleClick(user.ID)}
                      />
                    </TableCell>
                    <TableCell>{user.ID}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.registration_date}</TableCell>
                    <TableCell>{user.last_login_date}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleChangeStatus(
                            user.ID,
                            user.status === "active" ? "inactive" : "active"
                          )
                        }
                      >
                        {user.status === "active" ? (
                          <BlockIcon color="error" />
                        ) : (
                          <CheckCircleIcon color="success" />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(user.ID)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard; 