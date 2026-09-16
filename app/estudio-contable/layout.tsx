import type {Metadata} from 'next';
import './accounting.css';
const title='FORCH LAU | Estudio contable y asesoría empresarial';
const description='Asesoría empresarial, tributaria, contable y laboral para empresas que buscan claridad y crecimiento.';
export const metadata:Metadata={title,description,openGraph:{title,description,type:'website'},twitter:{card:'summary_large_image',title,description}};
export default function Layout({children}:{children:React.ReactNode}){return children}
