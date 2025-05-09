import { ArrowLeft, User, Building, Pencil, Save, Loader2, X, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useActivity from '@/hooks/use-activity';
import ActivityTable from '@/components/activity/activitytable';
import useDetailProgram from '@/hooks/use-detailprogram';
import { pilarOptions, Program } from '@/types/program';

const DetailProgram = () => {
    const {
        loading,
        kegiatanLoading,
        program,
        editedProgram,
        setEditedProgram,
        saving,
        isEditing,
        kegiatanList,
        coverPreview,
        setCoverPreview,
        coverFile,
        setCoverFile,
        statusBg,
        editedStatusBg,
        handleChange,
        handleEditClick,
        handleCancel,
        handleSaveClick,
        handleCoverChange,
        handleNavigateDetail
    } = useDetailProgram()

    const {
        displayedActivities,
        handleNavigate,
        handleShareActivity,
        handleDeleteClick,
        sortColumn,
        handleSortChange
    } = useActivity()

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
            <CardHeader>
                <div className='justify-between items-top flex'>
                    <div className="flex items-center space-x-2">
                        <ArrowLeft 
                        className="h-6 w-6 text-slate-700 hover:cursor-pointer" 
                        onClick={() => { handleNavigateDetail() }}
                        />
                        <h2 className="text-xl font-medium text-[var(--blue)]">Detail Program</h2>
                    </div>
                    <div className="flex flex-col text-xs space-y-2 text-right text-gray-700">
                        <p>
                            <strong>Created At:</strong>{" "}
                            {program?.created_at ? new Date(program.created_at).toLocaleString() : "N/A"}
                        </p>
                        <p>
                            <strong>Updated At:</strong>{" "}
                            {program?.updated_at ? new Date(program.updated_at).toLocaleString() : "N/A"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : (
                    <>
                        <div className='space-y-2'>
                            <div className="mb-4">
                                {coverPreview ? (
                                    <div className="relative w-full h-96 overflow-hidden rounded-lg">
                                    <img
                                        src={coverPreview}
                                        className="w-full h-full object-cover"
                                        alt="Cover"
                                    />
                                    {isEditing && (
                                        <button
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                                        onClick={() => {
                                            setCoverFile(null);
                                            setCoverPreview(null);
                                        }}
                                        >
                                        <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    )}
                                    </div>
                                ) : (
                                    isEditing && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                                        <input
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                        />
                                        <label htmlFor="cover-upload" className="flex items-center gap-2 text-[var(--green)] cursor-pointer">
                                        <Upload className="w-5 h-5" />
                                        <span>Unggah Cover Program</span>
                                        </label>
                                    </div>
                                    )
                                )}
                            </div>
                            <div className="flex justify-between align-baseline">
                                <div className="space-y-4 align-bottom">
                                    <h1 className="text-3xl font-semibold">{String(program?.nama_program ?? "Program Masjid")}</h1>
                                    {isEditing ? (
                                        <Select
                                            value={editedProgram?.status_program}
                                            onValueChange={(value) =>
                                            handleChange("status_program", value as Program["status_program"])
                                            }
                                        >
                                            <SelectTrigger
                                            className={`
                                                w-32 flex items-center justify-between
                                                ${editedStatusBg} text-white
                                            `}
                                            >
                                            <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {(
                                                ["Belum Mulai", "Berjalan", "Selesai"] as Program["status_program"][]
                                            ).map((status) => (
                                                <SelectItem
                                                key={status}
                                                value={status}
                                                className={`
                                                    flex items-center px-2 py-1text-white rounded
                                                `}
                                                >
                                                {status}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div
                                        className={`mt-2 flex justify-center items-center font-semibold w-28 h-8 rounded-xl md:rounded-2xl text-xs md:text-sm text-white ${statusBg}`}
                                        >
                                        {program.status_program}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end mt-6">
                                    {!isEditing ? (
                                        <Button className='h-10' variant="outline" onClick={handleEditClick}>
                                            <Pencil className="h-4 w-4 mr-2" /> Ubah
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                                Batal
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={handleSaveClick}
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" /> Simpan
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center mt-4 space-x-2">
                                <Building className='h-5 w-5 text-[#3A786D]'/>
                                <p className='text-[#3A786D] font-semibold'>Masjid Salman</p>
                            </div>
                            <div className="flex items-center space-x-2 ">
                                <User className='h-5 w-5 text-gray-500'/>
                                <p className='text-gray-500 font-semibold'> Dibuat oleh {String(program?.created_by ?? "Editor")}</p>
                            </div>
                        </div>

                        <Table className="border border-t-0 border-l-0 border-r-0 last:border-b-0 my-6 w-full">
                            <TableBody>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Deskripsi Program</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <Textarea
                                                value={editedProgram?.deskripsi_program}
                                                onChange={(e) => handleChange("deskripsi_program", e.target.value)}
                                                className="w-full min-h-[120px]"
                                            />
                                        ) : (
                                            <div className="whitespace-pre-wrap">{String(program?.deskripsi_program)}</div>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Pilar Program</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 max-h-[300px] overflow-y-auto p-2">
                                                {pilarOptions.map((pilar) => (
                                                    <div key={pilar.name} className="flex items-center space-x-2 py-1">
                                                        <Checkbox 
                                                            id={`pilar-${pilar.name}`} 
                                                            checked={
                                                                Array.isArray(editedProgram?.pilar_program) 
                                                                ? editedProgram.pilar_program.includes(pilar.name)
                                                                : false
                                                            }
                                                            onCheckedChange={(checked) => {
                                                                const currentPilars = Array.isArray(editedProgram?.pilar_program) 
                                                                    ? editedProgram.pilar_program 
                                                                    : [];
                                                                
                                                                const newPilars = checked 
                                                                    ? [...currentPilars, pilar.name]
                                                                    : currentPilars.filter(p => p !== pilar.name);
                                                                console.log("current pillars",currentPilars)
                                                                setEditedProgram(prev => {
                                                                    if (!prev) {
                                                                        return null;
                                                                    }
                                                                    
                                                                    return {
                                                                        ...prev,
                                                                        pilar_program: newPilars, 
                                                                    };
                                                                });
                                                            }}
                                                        />
                                                        <Label 
                                                            htmlFor={`pilar-${pilar.name}`}
                                                            className="text-sm font-normal"
                                                        >
                                                            {pilar.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap">
                                                {Array.isArray(program?.pilar_program) 
                                                    ? program.pilar_program.join(', ') 
                                                    : String(program?.pilar_program)}
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Kriteria Program</TableHead>
                                    <TableCell className="w-full break-words">
                                        <div className="flex items-center space-x-2 w-full">
                                            {isEditing ? (
                                                <Input
                                                    value={editedProgram?.kriteria_program}
                                                    onChange={(e) => handleChange("kriteria_program", e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(program?.kriteria_program)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Tanggal Mulai</TableHead>
                                    <TableCell className="w-full">
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedProgram?.waktu_mulai}
                                                onChange={(e) => handleChange("waktu_mulai", e.target.value)}
                                                className="w-full md:w-auto"
                                            />
                                        ) : (
                                            String(program?.waktu_mulai)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Tanggal Selesai</TableHead>
                                    <TableCell className="w-full">
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedProgram?.waktu_selesai}
                                                onChange={(e) => handleChange("waktu_selesai", e.target.value)}
                                                className="w-full md:w-auto"
                                            />
                                        ) : (
                                            String(program?.waktu_selesai)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Rancangan Anggaran</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editedProgram?.rancangan_anggaran}
                                                onChange={(e) => handleChange("rancangan_anggaran", parseInt(e.target.value) || 0)}
                                                className="w-full md:w-auto"
                                            />
                                        ) : (
                                            <span>
                                                Rp{String(program?.rancangan_anggaran?.toLocaleString() ?? "0")}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Aktualisasi Anggaran</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editedProgram?.aktualisasi_anggaran}
                                                onChange={(e) => handleChange("aktualisasi_anggaran", parseInt(e.target.value) || 0)}
                                            />
                                        ) : (
                                            <span>
                                                Rp{String(program?.aktualisasi_anggaran?.toLocaleString() ?? "0")}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div className="my-6 space-y-3">
                            <h1 className="text-2xl">Kegiatan Program</h1>
                            {kegiatanLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                                </div>
                            ) : kegiatanList.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Tidak terdapat kegiatan untuk program ini.</p>
                            ) : (
                                <ActivityTable
                                    activities={displayedActivities}
                                    sortColumn={sortColumn}
                                    onSortChange={handleSortChange}
                                    onNavigate={handleNavigate}
                                    onShare={handleShareActivity}
                                    onDelete={handleDeleteClick}
                                />
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailProgram;