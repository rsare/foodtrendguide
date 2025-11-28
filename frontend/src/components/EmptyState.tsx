const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center text-gray-400 py-20">
        <p>{message}</p>
    </div>
);

export default EmptyState;
