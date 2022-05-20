export default function Layout({ children }) {
    return (
        <div className="next">
            <div>
                {children}
            </div>
            <style jsx>
                {`
                .next {
                    position: relative;
                    border: 1px solid white;
                    padding: 8px;
                    height: 100vh;
                }
                `}
            </style>
        </div>
    )
}