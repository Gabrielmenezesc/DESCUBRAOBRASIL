import { assetPath } from '@/lib/assetPath';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
export default function AppEntry({title,description,section}:{title:string;description:string;section:string}){return <><Navbar/><main className="pro-page"><div className="pro-container"><p className="pro-kicker">DESCUBRA O BRASIL / APLICATIVO</p><h1>{title}</h1><p className="pro-lead">{description}</p><a className="pro-button" href={assetPath(`/app/index.html#${section}`)}>Abrir no aplicativo</a></div></main><FooterSection/></>;}
