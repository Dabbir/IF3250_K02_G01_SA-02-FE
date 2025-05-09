"use client"

import { Button } from "@/components/ui/button";
import EmployeeCard from "@/components/employee/employeecard";
import EmployeeDialog from "@/components/employee/addemployeedialog";
import EmployeeSortControls from "@/components/employee/employeesortcontrol";
import EmployeeDeleteDialog from "@/components/employee/employeedeletedialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";

import useEmployee from "@/hooks/use-employee";

const Employee = () => {
    const {
        loading,
        search,
        setSearch,
        isOpen,
        setIsOpen,
        submitting,
        masjidName,
        newEmployee,
        setNewEmployee,
        deletingEmployee,
        sortOrder,
        sortColumn,
        setSortColumn,
        setSortOrder,
        isDeleting,
        handleNavigate,
        showDeleteDialog,
        setShowDeleteDialog,
        currentPage,
        totalPages,
        setCurrentPage,
        displayedEmployees,
        handleOpenChange,
        handleDeleteEmployee,
        confirmDeleteEmployee,
        handleSubmit
    } = useEmployee()

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
            <CardHeader>
                <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-slate-700" />
                <h2 className="text-xl font-medium text-[var(--blue)]">Karyawan</h2>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-4 items-center gap-4">
                    <div className="flex relative w-full md:w-2/5 gap-2">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Cari karyawan..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10"
                        />

                        <EmployeeSortControls
                            sortBy={sortColumn}
                            sortOrder={sortOrder}
                            onSortByChange={(column) => {
                                setSortColumn(column);
                                setCurrentPage(1);
                            }}
                            onSortOrderToggle={() => {
                                setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button className="bg-[#3A786D] text-white" onClick={() => setIsOpen(true)}>
                        Tambah Karyawan
                        </Button>
                    </div>
                </div>
    
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : displayedEmployees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedEmployees.map((employee) => (
                        <div 
                            key={employee.id} 
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow max-w-full overflow-hidden cursor-pointer"
                        >
                            <EmployeeCard 
                                employee={employee}
                                masjidNameParam={employee.masjid_nama || masjidName}
                                onClick={() => handleNavigate(employee.id)}
                                onDelete={() => confirmDeleteEmployee(employee)}
                            />
                        </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-500 mb-2">Tidak ada karyawan yang ditemukan</p>
                        <p className="text-gray-400 text-sm">Silakan tambahkan karyawan baru atau ubah filter pencarian</p>
                    </div>
                )}
    
                {!loading && totalPages > 0 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <Button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="bg-[#3A786D] text-white"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => (
                    <Button 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        className={`${
                        currentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                        }`}
                    >
                        {i + 1}
                    </Button>
                    ))}

                    <Button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="bg-[#3A786D] text-white"
                    >
                        Next
                    </Button>
                </div>
                )}
    
                <EmployeeDialog
                    isOpen={isOpen}
                    setIsOpen={handleOpenChange}
                    newEmployee={newEmployee}
                    setNewEmployee={setNewEmployee}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />

                <EmployeeDeleteDialog
                    isOpen={showDeleteDialog}
                    setIsOpen={setShowDeleteDialog}
                    isDeleting={isDeleting}
                    onDelete={handleDeleteEmployee}
                    deletingEmployee={deletingEmployee}
                />
            </CardContent>
        </Card>
    );
}

export default Employee;