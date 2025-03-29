interface CardProgramProps {
    program: Program;
    onClick: () => void;
}

interface Program {
    id: number;
    nama_program: string;
    deskripsi_program: string;
    pilar_program: number[];
    kriteria_program: string;
    waktu_mulai: string;
    waktu_selesai: string;
    rancangan_anggaran: number;
    aktualisasi_anggaran: number;
    status_program: "Berjalan" | "Selesai";
    masjid_id: number;
    created_by: string;
    updated_at: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return ""
    };

    const month = date.toLocaleString("id-ID", { month: "short" }); 
    const year = date.getFullYear().toString();

    return `${month} ${year}`;
};

interface CardProgramProps {
    program: Program;
}

const CardProgram: React.FC<CardProgramProps> = ({ program, onClick }) => {
    return (
        <div className="flex justify-between hover:scale-101" onClick={onClick}>
            <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                
                <div className="h-52 flex justify-center items-center">
                    <img
                        src="/logo-white.svg"
                        className="w-full h-full object-cover rounded-t-xl"
                        alt="Program Logo"
                    />
                </div>
                <div className="p-6 md:p-8">
                    <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-blue-500">
                                {formatDate(program.waktu_mulai)} - {formatDate(program.waktu_selesai)}
                            </p>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                                {program.nama_program}
                            </h3>
                            <div className={`mt-2 flex justify-center items-center font-semibold w-20 h-8 rounded-xl md:rounded-2xl text-xs md:text-sm text-white ${
                                program.status_program === "Berjalan" ? "bg-[#ECA72C]" : "bg-[#3A786D]"
                            }`}>
                                {program.status_program}
                            </div>
                    </div>

                    <p className="mt-2 text-gray-500 dark:text-neutral-500">
                        {program.deskripsi_program}
                    </p>
                </div>

                <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                    <button className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-[#3A786D] shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                    Ubah
                    </button>
                    <button className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-[#804E49] shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                    Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardProgram;