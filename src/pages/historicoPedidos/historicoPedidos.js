import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { MdExpandMore } from 'react-icons/md';
import api from '../../services/api';

import './historicoPedidos.scss'






const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    }, heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));



export default function HistoricoPedidosl() {

    const classes = useStyles();
    const [pedidos, setPedidos] = useState([]);

    const usuario = sessionStorage.getItem('usuario');
    const { idUsuario } = usuario != null ? JSON.parse(usuario) : {};

    const [expanded, setExpanded] = React.useState(false);



    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleTrackStep = {
        PEDIDO_REALIZADO: value => 1,
        PAGAMENTO_CONFIRMADO: value => 2,
        PEDIDO_ENVIADO: value => 3,
        PEDIDO_ENTREGUE: value => 4,
        // default: value => value,
    };

    const changeTrackerStep = (statusPedido, value) => {
        const handler = handleTrackStep[statusPedido]
        return handler(value);
    };


    useEffect(() => {
        api.get(`historico-pedidos/${idUsuario}`, {

        }).then(response => {
            // setPedidos(response.data)
            setPedidos(response.data);

        })
    }, [idUsuario]);



    // api.get('/auth/token', {

    // }).then((response => {
    //     sessionStorage.setItem("usuario", JSON.stringify(response.data))
    //     history.push("/")
    //     window.location.reload();


    // })).catch((error) => {
    //     if (401 === error.response.status){
    //         return alert("Usuário ou senha não conferem");
    // }
    //     alert("Erro não esperado");
    // });



    return (
        <>
            <div className="pedido-container">
                <div className="content">
                    <h1>Pedidos realizados</h1>
                    <div className={classes.root}>
                        {pedidos.map(pedido => (



                            <ExpansionPanel key={pedido.idPedido} TransitionProps={{ unmountOnExit: true }} expanded={expanded === `panel${pedido.idPedido}`} onChange={handleChange(`panel${pedido.idPedido}`)}>
                                <ExpansionPanelSummary
                                    expandIcon={<MdExpandMore />}
                                    aria-controls={`panel${pedido.idPedido}c-content`}
                                    id={`panel${pedido.idPedido}c-header`}>
                                    <div className={classes.column}>
                                        <Typography className={classes.heading}>Pedido: #{pedido.idPedido}</Typography>
                                    </div>
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>ooba, pedido entregue</Typography>
                                    </div>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails className={classes.details}>                    
                                    <ol className="progress-track" data-steps="4">
                                        <li className={changeTrackerStep(pedido.statusPedido)>=1?"done":""}>
                                            <span className="name">Pedido realizado</span>
                                            <span className="step"><span>1</span></span>
                                        </li>
                                        <li className={changeTrackerStep(pedido.statusPedido)>=2?"done":""}>
                                            <span className="name">Pagamento confirmado</span>
                                            <span className="step"><span>2</span></span>
                                        </li>
                                        <li className={changeTrackerStep(pedido.statusPedido)>=3?"done":""}>
                                            <span className="name">Pedido enviado</span>
                                            <span className="step"><span>3</span></span>
                                        </li>
                                        <li className={changeTrackerStep(pedido.statusPedido)>=4?"done":""}>
                                            <span className="name">Pedido entregue</span>
                                            <span className="step"><span>4</span></span>
                                        </li>
                                    </ol>
                                </ExpansionPanelDetails>


                                {pedido.pedidoItens.map(pedidoItem => (

                                    <div key={pedidoItem.idPedidoItem}>

                                        <ExpansionPanelDetails className={classes.details}>
                                            {/* <div className={classes.column} /> */}
                                            <div className={classes.column}>
                                                {/* <Chip label="Barbados" onDelete={() => {}} /> */}
                                                <img width="80" src={pedidoItem.produto.imagem} alt="" />
                                            </div>
                                            <div className={clsx(classes.column, classes.helper)}>
                                                <Typography variant="caption">
                                                    <p>{pedidoItem.produto.nome}</p>
                                                    <strong>{pedidoItem.quantidade} und - {pedidoItem.precoVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                                    <p>Subtotal: {((pedidoItem.quantidade) * (pedidoItem.precoVendido)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                                </Typography>
                                            </div>
                                        </ExpansionPanelDetails>

                                    </div>





                                ))}


                                <Divider />

                                <ExpansionPanelActions>
                                    {/* <Button size="small">Cancel</Button> */}
                                    <strong >Total - {pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    <Button size="small" color="primary">
                                        Refazer pedido
                                                 </Button>
                                </ExpansionPanelActions>
                            </ExpansionPanel>










                        ))}

                    </div>
                </div>
            </div>
        </>
    );

}