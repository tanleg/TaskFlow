------------------------------------------------------------
--        Script Postgre 
------------------------------------------------------------



------------------------------------------------------------
-- Table: utilisateur
------------------------------------------------------------
CREATE TABLE public.utilisateur(
	id             SERIAL NOT NULL ,
	nom            VARCHAR (50) NOT NULL ,
	prenom         VARCHAR (50) NOT NULL ,
	email          VARCHAR (150) NOT NULL ,
	mot_de_passe   VARCHAR (255) NOT NULL ,
	telephone      VARCHAR (15) NOT NULL ,
	admin          BOOL  NOT NULL  ,
	CONSTRAINT utilisateur_PK PRIMARY KEY (id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: statut_projet
------------------------------------------------------------
CREATE TABLE public.statut_projet(
	statut   VARCHAR (150) NOT NULL  ,
	CONSTRAINT statut_projet_PK PRIMARY KEY (statut)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: projet
------------------------------------------------------------
CREATE TABLE public.projet(
	id              SERIAL NOT NULL ,
	nom             VARCHAR (150) NOT NULL ,
	description     VARCHAR (2000)  NOT NULL ,
	date_creation   DATE  NOT NULL ,
	public          BOOL  NOT NULL ,
	statut          VARCHAR (150) NOT NULL  ,
	CONSTRAINT projet_PK PRIMARY KEY (id)

	,CONSTRAINT projet_statut_projet_FK FOREIGN KEY (statut) REFERENCES public.statut_projet(statut)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: fichier
------------------------------------------------------------
CREATE TABLE public.fichier(
	id            SERIAL NOT NULL ,
	nom           VARCHAR (50) NOT NULL ,
	url           VARCHAR (200) NOT NULL ,
	date_upload   DATE  NOT NULL ,
	version       INT  NOT NULL ,
	upload_par    VARCHAR (255) NOT NULL ,
	id_projet     INT  NOT NULL  ,
	CONSTRAINT fichier_PK PRIMARY KEY (id)

	,CONSTRAINT fichier_projet_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: notif
------------------------------------------------------------
CREATE TABLE public.notif(
	id          SERIAL NOT NULL ,
	titre       VARCHAR (50) NOT NULL ,
	contenu     VARCHAR (2000)  NOT NULL ,
	date        DATE  NOT NULL ,
	id_projet   INT  NOT NULL  ,
	CONSTRAINT notif_PK PRIMARY KEY (id)

	,CONSTRAINT notif_projet_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: jalon
------------------------------------------------------------
CREATE TABLE public.jalon(
	id          SERIAL NOT NULL ,
	nom         VARCHAR (100) NOT NULL ,
	date_fin    DATE  NOT NULL ,
	id_projet   INT  NOT NULL  ,
	CONSTRAINT jalon_PK PRIMARY KEY (id)

	,CONSTRAINT jalon_projet_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: livrable
------------------------------------------------------------
CREATE TABLE public.livrable(
	id                SERIAL NOT NULL ,
	nom               VARCHAR (50) NOT NULL ,
	date_fin          DATE  NOT NULL ,
	date_fin_reelle   DATE   ,
	termine           BOOL  NOT NULL ,
	id_projet         INT  NOT NULL  ,
	CONSTRAINT livrable_PK PRIMARY KEY (id)

	,CONSTRAINT livrable_projet_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: tache
------------------------------------------------------------
CREATE TABLE public.tache(
	id                SERIAL NOT NULL ,
	nom               VARCHAR (50) NOT NULL ,
	date_debut        DATE  NOT NULL ,
	date_fin_reelle   DATE   ,
	date_fin          DATE  NOT NULL ,
	termine           BOOL  NOT NULL ,
	id_projet         INT  NOT NULL ,
	id_utilisateur    INT  NOT NULL  ,
	CONSTRAINT tache_PK PRIMARY KEY (id)

	,CONSTRAINT tache_projet_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
	,CONSTRAINT tache_utilisateur0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: entreprise
------------------------------------------------------------
CREATE TABLE public.entreprise(
	entreprise   VARCHAR (200) NOT NULL  ,
	CONSTRAINT entreprise_PK PRIMARY KEY (entreprise)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: partenaire
------------------------------------------------------------
CREATE TABLE public.partenaire(
	id           SERIAL NOT NULL ,
	nom          VARCHAR (150) NOT NULL ,
	prenom       VARCHAR (150) NOT NULL ,
	email        VARCHAR (150) NOT NULL ,
	lien         VARCHAR (200) NOT NULL ,
	token        VARCHAR (255) NOT NULL ,
	id_projet    INT  NOT NULL ,
	entreprise   VARCHAR (200) NOT NULL  ,
	CONSTRAINT partenaire_PK PRIMARY KEY (id)

	,CONSTRAINT partenaire_projet_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
	,CONSTRAINT partenaire_entreprise0_FK FOREIGN KEY (entreprise) REFERENCES public.entreprise(entreprise)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: message
------------------------------------------------------------
CREATE TABLE public.message(
	id               SERIAL NOT NULL ,
	texte            VARCHAR (2000)  NOT NULL ,
	date_envoi       DATE  NOT NULL ,
	id_utilisateur   INT   ,
	id_projet        INT  NOT NULL ,
	id_partenaire    INT    ,
	CONSTRAINT message_PK PRIMARY KEY (id)

	,CONSTRAINT message_utilisateur_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id)
	,CONSTRAINT message_projet0_FK FOREIGN KEY (id_projet) REFERENCES public.projet(id)
	,CONSTRAINT message_partenaire1_FK FOREIGN KEY (id_partenaire) REFERENCES public.partenaire(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: utilisateur_projet
------------------------------------------------------------
CREATE TABLE public.utilisateur_projet(
	id               INT  NOT NULL ,
	id_utilisateur   INT  NOT NULL ,
	chef             BOOL  NOT NULL ,
	visiteur         BOOL  NOT NULL  ,
	CONSTRAINT utilisateur_projet_PK PRIMARY KEY (id,id_utilisateur)

	,CONSTRAINT utilisateur_projet_projet_FK FOREIGN KEY (id) REFERENCES public.projet(id)
	,CONSTRAINT utilisateur_projet_utilisateur0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: utilisateur_jalon
------------------------------------------------------------
CREATE TABLE public.utilisateur_jalon(
	id               INT  NOT NULL ,
	id_utilisateur   INT  NOT NULL  ,
	CONSTRAINT utilisateur_jalon_PK PRIMARY KEY (id,id_utilisateur)

	,CONSTRAINT utilisateur_jalon_jalon_FK FOREIGN KEY (id) REFERENCES public.jalon(id)
	,CONSTRAINT utilisateur_jalon_utilisateur0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: utilisateur_livrable
------------------------------------------------------------
CREATE TABLE public.utilisateur_livrable(
	id               INT  NOT NULL ,
	id_utilisateur   INT  NOT NULL  ,
	CONSTRAINT utilisateur_livrable_PK PRIMARY KEY (id,id_utilisateur)

	,CONSTRAINT utilisateur_livrable_livrable_FK FOREIGN KEY (id) REFERENCES public.livrable(id)
	,CONSTRAINT utilisateur_livrable_utilisateur0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: utilisateur_notif
------------------------------------------------------------
CREATE TABLE public.utilisateur_notif(
	id               INT  NOT NULL ,
	id_utilisateur   INT  NOT NULL  ,
	CONSTRAINT utilisateur_notif_PK PRIMARY KEY (id,id_utilisateur)

	,CONSTRAINT utilisateur_notif_notif_FK FOREIGN KEY (id) REFERENCES public.notif(id)
	,CONSTRAINT utilisateur_notif_utilisateur0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id)
)WITHOUT OIDS;



