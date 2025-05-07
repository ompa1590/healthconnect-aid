import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, CheckCircle, Clock, User, XCircle, Edit, Eye, MessageSquare, Phone, Video } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import ConsultationNotes from "./ConsultationNotes";
import ConsultationConfirmation from "./ConsultationConfirmation";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/liveblocks.config";
import { useRoom } from "@/liveblocks.config";
import { LiveList, useObject } from "@liveblocks/react";
import { useMutation } from "@liveblocks/react";
import { shallow } from "@liveblocks/client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { generateConsultationNotes } from "@/lib/ai";
import { useDebounce } from "@/hooks/useDebounce";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  status: string;
}

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showChartDialog, setShowChartDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [showConsultDialog, setShowConsultDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCanceling, setIsCanceling] = useState(false);
  const [isConsultationSaving, setIsConsultationSaving] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [isConsultationAcknowledged, setIsConsultationAcknowledged] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [isNotesGenerated, setIsNotesGenerated] = useState(false);
  const [isNotesBeingEdited, setIsNotesBeingEdited] = useState(false);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isNotesError, setIsNotesError] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [isNotesSuccess, setIsNotesSuccess] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState("");
  const [isNotesEmpty, setIsNotesEmpty] = useState(false);
  const [isNotesTooLong, setIsNotesTooLong] = useState(false);
  const [isNotesTooShort, setIsNotesTooShort] = useState(false);
  const [isNotesTooGeneric, setIsNotesTooGeneric] = useState(false);
  const [isNotesTooRepetitive, setIsNotesTooRepetitive] = useState(false);
  const [isNotesTooTechnical, setIsNotesTooTechnical] = useState(false);
  const [isNotesTooInformal, setIsNotesTooInformal] = useState(false);
  const [isNotesTooFormal, setIsNotesTooFormal] = useState(false);
  const [isNotesTooVague, setIsNotesTooVague] = useState(false);
  const [isNotesTooSpecific, setIsNotesTooSpecific] = useState(false);
  const [isNotesTooEmotional, setIsNotesTooEmotional] = useState(false);
  const [isNotesTooObjective, setIsNotesTooObjective] = useState(false);
  const [isNotesTooPersonal, setIsNotesTooPersonal] = useState(false);
  const [isNotesTooImpersonal, setIsNotesTooImpersonal] = useState(false);
  const [isNotesTooOptimistic, setIsNotesTooOptimistic] = useState(false);
  const [isNotesTooPessimistic, setIsNotesTooPessimistic] = useState(false);
  const [isNotesTooDetailed, setIsNotesTooDetailed] = useState(false);
  const [isNotesTooBrief, setIsNotesTooBrief] = useState(false);
  const [isNotesTooComplex, setIsNotesTooComplex] = useState(false);
  const [isNotesTooSimple, setIsNotesTooSimple] = useState(false);
  const [isNotesTooCreative, setIsNotesTooCreative] = useState(false);
  const [isNotesTooLiteral, setIsNotesTooLiteral] = useState(false);
  const [isNotesTooSubjective, setIsNotesTooSubjective] = useState(false);
  const [isNotesTooObjective2, setIsNotesTooObjective2] = useState(false);
  const [isNotesTooGeneral, setIsNotesTooGeneral] = useState(false);
  const [isNotesTooParticular, setIsNotesTooParticular] = useState(false);
  const [isNotesTooAbstract, setIsNotesTooAbstract] = useState(false);
  const [isNotesTooConcrete, setIsNotesTooConcrete] = useState(false);
  const [isNotesTooTheoretical, setIsNotesTooTheoretical] = useState(false);
  const [isNotesTooPractical, setIsNotesTooPractical] = useState(false);
  const [isNotesTooConventional, setIsNotesTooConventional] = useState(false);
  const [isNotesTooUnconventional, setIsNotesTooUnconventional] = useState(false);
  const [isNotesTooTraditional, setIsNotesTooTraditional] = useState(false);
  const [isNotesTooModern, setIsNotesTooModern] = useState(false);
  const [isNotesTooConservative, setIsNotesTooConservative] = useState(false);
  const [isNotesTooLiberal, setIsNotesTooLiberal] = useState(false);
  const [isNotesTooRadical, setIsNotesTooRadical] = useState(false);
  const [isNotesTooModerate, setIsNotesTooModerate] = useState(false);
  const [isNotesTooDogmatic, setIsNotesTooDogmatic] = useState(false);
  const [isNotesTooSkeptical, setIsNotesTooSkeptical] = useState(false);
  const [isNotesTooEmotional2, setIsNotesTooEmotional2] = useState(false);
  const [isNotesTooRational, setIsNotesTooRational] = useState(false);
  const [isNotesTooIntuitive, setIsNotesTooIntuitive] = useState(false);
  const [isNotesTooEmpirical, setIsNotesTooEmpirical] = useState(false);
  const [isNotesTooSpeculative, setIsNotesTooSpeculative] = useState(false);
  const [isNotesTooDescriptive, setIsNotesTooDescriptive] = useState(false);
  const [isNotesTooAnalytical, setIsNotesTooAnalytical] = useState(false);
  const [isNotesTooSynthetic, setIsNotesTooSynthetic] = useState(false);
  const [isNotesTooDeductive, setIsNotesTooDeductive] = useState(false);
  const [isNotesTooInductive, setIsNotesTooInductive] = useState(false);
  const [isNotesTooCritical, setIsNotesTooCritical] = useState(false);
  const [isNotesTooSupportive, setIsNotesTooSupportive] = useState(false);
  const [isNotesTooFormal2, setIsNotesTooFormal2] = useState(false);
  const [isNotesTooInformal2, setIsNotesTooInformal2] = useState(false);
  const [isNotesTooTechnical2, setIsNotesTooTechnical2] = useState(false);
  const [isNotesTooNonTechnical, setIsNotesTooNonTechnical] = useState(false);
  const [isNotesTooVerbose, setIsNotesTooVerbose] = useState(false);
  const [isNotesTooConcise, setIsNotesTooConcise] = useState(false);
  const [isNotesTooDetailed2, setIsNotesTooDetailed2] = useState(false);
  const [isNotesTooSuperficial, setIsNotesTooSuperficial] = useState(false);
  const [isNotesTooComplex2, setIsNotesTooComplex2] = useState(false);
  const [isNotesTooSimple2, setIsNotesTooSimple2] = useState(false);
  const [isNotesTooCreative2, setIsNotesTooCreative2] = useState(false);
  const [isNotesTooLiteral2, setIsNotesTooLiteral2] = useState(false);
  const [isNotesTooSubjective3, setIsNotesTooSubjective3] = useState(false);
  const [isNotesTooObjective4, setIsNotesTooObjective4] = useState(false);
  const [isNotesTooGeneral3, setIsNotesTooGeneral3] = useState(false);
  const [isNotesTooParticular3, setIsNotesTooParticular3] = useState(false);
  const [isNotesTooAbstract3, setIsNotesTooAbstract3] = useState(false);
  const [isNotesTooConcrete3, setIsNotesTooConcrete3] = useState(false);
  const [isNotesTooTheoretical3, setIsNotesTooTheoretical3] = useState(false);
  const [isNotesTooPractical3, setIsNotesTooPractical3] = useState(false);
  const [isNotesTooConventional3, setIsNotesTooConventional3] = useState(false);
  const [isNotesTooUnconventional3, setIsNotesTooUnconventional3] = useState(false);
  const [isNotesTooTraditional3, setIsNotesTooTraditional3] = useState(false);
  const [isNotesTooModern3, setIsNotesTooModern3] = useState(false);
  const [isNotesTooConservative3, setIsNotesTooConservative3] = useState(false);
  const [isNotesTooLiberal3, setIsNotesTooLiberal3] = useState(false);
  const [isNotesTooRadical3, setIsNotesTooRadical3] = useState(false);
  const [isNotesTooModerate3, setIsNotesTooModerate3] = useState(false);
  const [isNotesTooDogmatic3, setIsNotesTooDogmatic3] = useState(false);
  const [isNotesTooSkeptical3, setIsNotesTooSkeptical3] = useState(false);
  const [isNotesTooEmotional4, setIsNotesTooEmotional4] = useState(false);
  const [isNotesTooRational4, setIsNotesTooRational4] = useState(false);
  const [isNotesTooIntuitive4, setIsNotesTooIntuitive4] = useState(false);
  const [isNotesTooEmpirical4, setIsNotesTooEmpirical4] = useState(false);
  const [isNotesTooSpeculative4, setIsNotesTooSpeculative4] = useState(false);
  const [isNotesTooDescriptive4, setIsNotesTooDescriptive4] = useState(false);
  const [isNotesTooAnalytical4, setIsNotesTooAnalytical4] = useState(false);
  const [isNotesTooSynthetic4, setIsNotesTooSynthetic4] = useState(false);
  const [isNotesTooDeductive4, setIsNotesTooDeductive4] = useState(false);
  const [isNotesTooInductive4, setIsNotesTooInductive4] = useState(false);
  const [isNotesTooCritical4, setIsNotesTooCritical4] = useState(false);
  const [isNotesTooSupportive4, setIsNotesTooSupportive4] = useState(false);
  const [isNotesTooFormal5, setIsNotesTooFormal5] = useState(false);
  const [isNotesTooInformal5, setIsNotesTooInformal5] = useState(false);
  const [isNotesTooTechnical5, setIsNotesTooTechnical5] = useState(false);
  const [isNotesTooNonTechnical5, setIsNotesTooNonTechnical5] = useState(false);
  const [isNotesTooVerbose5, setIsNotesTooVerbose5] = useState(false);
  const [isNotesTooConcise5, setIsNotesTooConcise5] = useState(false);
  const [isNotesTooDetailed6, setIsNotesTooDetailed6] = useState(false);
  const [isNotesTooSuperficial6, setIsNotesTooSuperficial6] = useState(false);
  const [isNotesTooComplex6, setIsNotesTooComplex6] = useState(false);
  const [isNotesTooSimple6, setIsNotesTooSimple6] = useState(false);
  const [isNotesTooCreative6, setIsNotesTooCreative6] = useState(false);
  const [isNotesTooLiteral6, setIsNotesTooLiteral6] = useState(false);
  const [isNotesTooSubjective7, setIsNotesTooSubjective7] = useState(false);
  const [isNotesTooObjective8, setIsNotesTooObjective8] = useState(false);
  const [isNotesTooGeneral7, setIsNotesTooGeneral7] = useState(false);
  const [isNotesTooParticular7, setIsNotesTooParticular7] = useState(false);
  const [isNotesTooAbstract7, setIsNotesTooAbstract7] = useState(false);
  const [isNotesTooConcrete7, setIsNotesTooConcrete7] = useState(false);
  const [isNotesTooTheoretical7, setIsNotesTooTheoretical7] = useState(false);
  const [isNotesTooPractical7, setIsNotesTooPractical7] = useState(false);
  const [isNotesTooConventional7, setIsNotesTooConventional7] = useState(false);
  const [isNotesTooUnconventional7, setIsNotesTooUnconventional7] = useState(false);
  const [isNotesTooTraditional7, setIsNotesTooTraditional7] = useState(false);
  const [isNotesTooModern7, setIsNotesTooModern7] = useState(false);
  const [isNotesTooConservative7, setIsNotesTooConservative7] = useState(false);
  const [isNotesTooLiberal7, setIsNotesTooLiberal7] = useState(false);
  const [isNotesTooRadical7, setIsNotesTooRadical7] = useState(false);
  const [isNotesTooModerate7, setIsNotesTooModerate7] = useState(false);
  const [isNotesTooDogmatic7, setIsNotesTooDogmatic7] = useState(false);
  const [isNotesTooSkeptical7, setIsNotesTooSkeptical7] = useState(false);
  const [isNotesTooEmotional8, setIsNotesTooEmotional8] = useState(false);
  const [isNotesTooRational8, setIsNotesTooRational8] = useState(false);
  const [isNotesTooIntuitive8, setIsNotesTooIntuitive8] = useState(false);
  const [isNotesTooEmpirical8, setIsNotesTooEmpirical8] = useState(false);
  const [isNotesTooSpeculative8, setIsNotesTooSpeculative8] = useState(false);
  const [isNotesTooDescriptive8, setIsNotesTooDescriptive8] = useState(false);
  const [isNotesTooAnalytical8, setIsNotesTooAnalytical8] = useState(false);
  const [isNotesTooSynthetic8, setIsNotesTooSynthetic8] = useState(false);
  const [isNotesTooDeductive8, setIsNotesTooDeductive8] = useState(false);
  const [isNotesTooInductive8, setIsNotesTooInductive8] = useState(false);
  const [isNotesTooCritical8, setIsNotesTooCritical8] = useState(false);
  const [isNotesTooSupportive8, setIsNotesTooSupportive8] = useState(false);
  const [isNotesTooFormal9, setIsNotesTooFormal9] = useState(false);
  const [isNotesTooInformal9, setIsNotesTooInformal9] = useState(false);
  const [isNotesTooTechnical9, setIsNotesTooTechnical9] = useState(false);
  const [isNotesTooNonTechnical9, setIsNotesTooNonTechnical9] = useState(false);
  const [isNotesTooVerbose9, setIsNotesTooVerbose9] = useState(false);
  const [isNotesTooConcise9, setIsNotesTooConcise9] = useState(false);
  const [isNotesTooDetailed10, setIsNotesTooDetailed10] = useState(false);
  const [isNotesTooSuperficial10, setIsNotesTooSuperficial10] = useState(false);
  const [isNotesTooComplex10, setIsNotesTooComplex10] = useState(false);
  const [isNotesTooSimple10, setIsNotesTooSimple10] = useState(false);
  const [isNotesTooCreative10, setIsNotesTooCreative10] = useState(false);
  const [isNotesTooLiteral10, setIsNotesTooLiteral10] = useState(false);
  const [isNotesTooSubjective11, setIsNotesTooSubjective11] = useState(false);
  const [isNotesTooObjective12, setIsNotesTooObjective12] = useState(false);
  const [isNotesTooGeneral11, setIsNotesTooGeneral11] = useState(false);
  const [isNotesTooParticular11, setIsNotesTooParticular11] = useState(false);
  const [isNotesTooAbstract11, setIsNotesTooAbstract11] = useState(false);
  const [isNotesTooConcrete11, setIsNotesTooConcrete11] = useState(false);
  const [isNotesTooTheoretical11, setIsNotesTooTheoretical11] = useState(false);
  const [isNotesTooPractical11, setIsNotesTooPractical11] = useState(false);
  const [isNotesTooConventional11, setIsNotesTooConventional11] = useState(false);
  const [isNotesTooUnconventional11, setIsNotesTooUnconventional11] = useState(false);
  const [isNotesTooTraditional11, setIsNotesTooTraditional11] = useState(false);
  const [isNotesTooModern11, setIsNotesTooModern11] = useState(false);
  const [isNotesTooConservative11, setIsNotesTooConservative11] = useState(false);
  const [isNotesTooLiberal11, setIsNotesTooLiberal11] = useState(false);
  const [isNotesTooRadical11, setIsNotesTooRadical11] = useState(false);
  const [isNotesTooModerate11, setIsNotesTooModerate11] = useState(false);
  const [isNotesTooDogmatic11, setIsNotesTooDogmatic11] = useState(false);
  const [isNotesTooSkeptical11, setIsNotesTooSkeptical11] = useState(false);
  const [isNotesTooEmotional12, setIsNotesTooEmotional12] = useState(false);
  const [isNotesTooRational12, setIsNotesTooRational12] = useState(false);
  const [isNotesTooIntuitive12, setIsNotesTooIntuitive12] = useState(false);
  const [isNotesTooEmpirical12, setIsNotesTooEmpirical12] = useState(false);
  const [isNotesTooSpeculative12, setIsNotesTooSpeculative12] = useState(false);
  const [isNotesTooDescriptive12, setIsNotesTooDescriptive12] = useState(false);
  const [isNotesTooAnalytical12, setIsNotesTooAnalytical12] = useState(false);
  const [isNotesTooSynthetic12, setIsNotesTooSynthetic12] = useState(false);
  const [isNotesTooDeductive12, setIsNotesTooDeductive12] = useState(false);
  const [isNotesTooInductive12, setIsNotesTooInductive12] = useState(false);
  const [isNotesTooCritical12, setIsNotesTooCritical12] = useState(false);
  const [isNotesTooSupportive12, setIsNotesTooSupportive12] = useState(false);
  const [isNotesTooFormal13, setIsNotesTooFormal13] = useState(false);
  const [isNotesTooInformal13, setIsNotesTooInformal13] = useState(false);
  const [isNotesTooTechnical13, setIsNotesTooTechnical13] = useState(false);
  const [isNotesTooNonTechnical13, setIsNotesTooNonTechnical13] = useState(false);
  const [isNotesTooVerbose13, setIsNotesTooVerbose13] = useState(false);
  const [isNotesTooConcise13, setIsNotesTooConcise13] = useState(false);
  const [isNotesTooDetailed14, setIsNotesTooDetailed14] = useState(false);
  const [isNotesTooSuperficial14, setIsNotesTooSuperficial14] = useState(false);
  const [isNotesTooComplex14, setIsNotesTooComplex14] = useState(false);
  const [isNotesTooSimple14, setIsNotesTooSimple14] = useState(false);
  const [isNotesTooCreative14, setIsNotesTooCreative14] = useState(false);
  const [isNotesTooLiteral14, setIsNotesTooLiteral14] = useState(false);
  const [isNotesTooSubjective15, setIsNotesTooSubjective15] = useState(false);
  const [isNotesTooObjective16, setIsNotesTooObjective16] = useState(false);
  const [isNotesTooGeneral15, setIsNotesTooGeneral15] = useState(false);
  const [isNotesTooParticular15, setIsNotesTooParticular15] = useState(false);
  const [isNotesTooAbstract15, setIsNotesTooAbstract15] = useState(false);
  const [isNotesTooConcrete15, setIsNotesTooConcrete15] = useState(false);
  const [isNotesTooTheoretical15, setIsNotesTooTheoretical15] = useState(false);
  const [isNotesTooPractical15, setIsNotesTooPractical15] = useState(false);
  const [isNotesTooConventional15, setIsNotesTooConventional15] = useState(false);
  const [isNotesTooUnconventional15, setIsNotesTooUnconventional15] = useState(false);
  const [isNotesTooTraditional15, setIsNotesTooTraditional15] = useState(false);
  const [isNotesTooModern15, setIsNotesTooModern15] = useState(false);
  const [isNotesTooConservative15, setIsNotesTooConservative15] = useState(false);
  const [isNotesTooLiberal15, setIsNotesTooLiberal15] = useState(false);
  const [isNotesTooRadical15, setIsNotesTooRadical15] = useState(false);
  const [isNotesTooModerate15, setIsNotesTooModerate15] = useState(false);
  const [isNotesTooDogmatic15, setIsNotesTooDogmatic15] = useState(false);
  const [isNotesTooSkeptical15, setIsNotesTooSkeptical15] = useState(false);
  const [isNotesTooEmotional16, setIsNotesTooEmotional16] = useState(false);
  const [isNotesTooRational16, setIsNotesTooRational16] = useState(false);
  const [isNotesTooIntuitive16, setIsNotesTooIntuitive16] = useState(false);
  const [isNotesTooEmpirical16, setIsNotesTooEmpirical16] = useState(false);
  const [isNotesTooSpeculative16, setIsNotesTooSpeculative16] = useState(false);
  const [isNotesTooDescriptive16, setIsNotesTooDescriptive16] = useState(false);
  const [isNotesTooAnalytical16, setIsNotesTooAnalytical16] = useState(false);
  const [isNotesTooSynthetic16, setIsNotesTooSynthetic16] = useState(false);
  const [isNotesTooDeductive16, setIsNotesTooDeductive16] = useState(false);
  const [isNotesTooInductive16, setIsNotesTooInductive16] = useState(false);
  const [isNotesTooCritical16, setIsNotesTooCritical16] = useState(false);
  const [isNotesTooSupportive16, setIsNotesTooSupportive16] = useState(false);
  const [isNotesTooFormal17, setIsNotesTooFormal17] = useState(false);
  const [isNotesTooInformal17, setIsNotesTooInformal17] = useState(false);
  const [isNotesTooTechnical17, setIsNotesTooTechnical17] = useState(false);
  const [isNotesTooNonTechnical17, setIsNotesTooNonTechnical17] = useState(false);
  const [isNotesTooVerbose17, setIsNotesTooVerbose17] = useState(false);
  const [isNotesTooConcise17, setIsNotesTooConcise17] = useState(false);
  const [isNotesTooDetailed18, setIsNotesTooDetailed18] = useState(false);
  const [isNotesTooSuperficial18, setIsNotesTooSuperficial18] = useState(false);
  const [isNotesTooComplex18, setIsNotesTooComplex18] = useState(false);
  const [isNotesTooSimple18, setIsNotesTooSimple18] = useState(false);
  const [isNotesTooCreative18, setIsNotesTooCreative18] = useState(false);
  const [isNotesTooLiteral18, setIsNotesTooLiteral18] = useState(false);
  const [isNotesTooSubjective19, setIsNotesTooSubjective19] = useState(false);
  const [isNotesTooObjective20, setIsNotesTooObjective20] = useState(false);
  const [isNotesTooGeneral19, setIsNotesTooGeneral19] = useState(false);
  const [isNotesTooParticular19, setIsNotesTooParticular19] = useState(false);
  const [isNotesTooAbstract19, setIsNotesTooAbstract19] = useState(false);
  const [isNotesTooConcrete19, setIsNotesTooConcrete19] = useState(false);
  const [isNotesTooTheoretical19, setIsNotesTooTheoretical19] = useState(false);
  const [isNotesTooPractical19, setIsNotesTooPractical19] = useState(false);
  const [isNotesTooConventional19, setIsNotesTooConventional19] = useState(false);
  const [isNotesTooUnconventional19, setIsNotesTooUnconventional19] = useState(false);
  const [isNotesTooTraditional19, setIsNotesTooTraditional19] = useState(false);
  const [isNotesTooModern19, setIsNotesTooModern19] = useState(false);
  const [isNotesTooConservative19, setIsNotesTooConservative19] = useState(false);
  const [isNotesTooLiberal19, setIsNotesTooLiberal19] = useState(false);
  const [isNotesTooRadical19, setIsNotesTooRadical19] = useState(false);
  const [isNotesTooModerate19, setIsNotesTooModerate19] = useState(false);
  const [isNotesTooDogmatic19, setIsNotesTooDogmatic19] = useState(false);
  const [isNotesTooSkeptical19, setIsNotesTooSkeptical19] = useState(false);
  const [isNotesTooEmotional20, setIsNotesTooEmotional20] = useState(false);
  const [isNotesTooRational20, setIsNotesTooRational20] = useState(false);
  const [isNotesTooIntuitive20, setIsNotesTooIntuitive20] = useState(false);
  const [isNotesTooEmpirical20, setIsNotesTooEmpirical20] = useState(false);
  const [isNotesTooSpeculative20, setIsNotesTooSpeculative20] = useState(false);
  const [isNotesTooDescriptive20, setIsNotesTooDescriptive20] = useState(false);
  const [isNotesTooAnalytical20, setIsNotesTooAnalytical20] = useState(false);
  const [isNotesTooSynthetic20, setIsNotesTooSynthetic20] = useState(false);
  const [isNotesTooDeductive20, setIsNotesTooDeductive20] = useState(false);
  const [isNotesTooInductive20, setIsNotesTooInductive20] = useState(false);
  const [isNotesTooCritical20, setIsNotesTooCritical20] = useState(false);
  const [isNotesTooSupportive20, setIsNotesTooSupportive20] = useState(false);
  const [isNotesTooFormal21, setIsNotesTooFormal21] = useState(false);
  const [isNotesTooInformal21, setIsNotesTooInformal21] = useState(false);
  const [isNotesTooTechnical21, setIsNotesTooTechnical21] = useState(false);
  const [isNotesTooNonTechnical21, setIsNotesTooNonTechnical21] = useState(false);
  const [isNotesTooVerbose21, setIsNotesTooVerbose21] = useState(false);
  const [isNotesTooConcise21, setIsNotesTooConcise21] = useState(false);
  const [isNotesTooDetailed22, setIsNotesTooDetailed22] = useState(false);
  const [isNotesTooSuperficial22, setIsNotesTooSuperficial22] = useState(false);
  const [isNotesTooComplex22, setIsNotesTooComplex22] = useState(false);
  const [isNotesTooSimple22, setIsNotesTooSimple22] = useState(false);
  const [isNotesTooCreative22, setIsNotesTooCreative22] = useState(false);
  const [isNotesTooLiteral22, setIsNotesTooLiteral22] = useState(false);
  const [isNotesTooSubjective23, setIsNotesTooSubjective23] = useState(false);
  const [isNotesTooObjective24, setIsNotesTooObjective24] = useState(false);
  const [isNotesTooGeneral23, setIsNotesTooGeneral23] = useState(false);
  const [isNotesTooParticular23, setIsNotesTooParticular23] = useState(false);
  const [isNotesTooAbstract23, setIsNotesTooAbstract23] = useState(false);
  const [isNotesTooConcrete23, setIsNotesTooConcrete23] = useState(false);
  const [isNotesTooTheoretical23, setIsNotesTooTheoretical23] = useState(false);
  const [isNotesTooPractical23, setIsNotesTooPractical23] = useState(false);
  const [isNotesTooConventional23, setIsNotesTooConventional23] = useState(false);
  const [isNotesTooUnconventional23, setIsNotesTooUnconventional23] = useState(false);
  const [isNotesTooTraditional23, setIsNotesTooTraditional23] = useState(false);
  const [isNotesTooModern23, setIsNotesTooModern23] = useState(false);
  const [isNotesTooConservative23, setIsNotesTooConservative23] = useState(false);
  const [isNotesTooLiberal23, setIsNotesTooLiberal23] = useState(false);
  const [isNotesTooRadical23, setIsNotesTooRadical23] = useState(false);
  const [isNotesTooModerate23, setIsNotesTooModerate23] = useState(false);
  const [isNotesTooDogmatic23, setIsNotesTooDogmatic23] = useState(false);
  const [isNotesTooSkeptical23, setIsNotesTooSkeptical23] = useState(false);
  const [isNotesTooEmotional24, setIsNotesTooEmotional24] = useState(false);
  const [isNotesTooRational24, setIsNotesTooRational24] = useState(false);
  const [isNotesTooIntuitive24, setIsNotesTooIntuitive24] = useState(false);
  const [isNotesTooEmpirical24, setIsNotesTooEmpirical24] = useState(false);
  const [isNotesTooSpeculative24, setIsNotesTooSpeculative24] = useState(false);
  const [isNotesTooDescriptive24, setIsNotesTooDescriptive24] = useState(false);
  const [isNotesTooAnalytical24, setIsNotesTooAnalytical24] = useState(false);
  const [isNotesTooSynthetic24, setIsNotesTooSynthetic24] = useState(false);
  const [isNotesTooDeductive24, setIsNotesTooDeductive24] = useState(false);
  const [isNotesTooInductive24, setIsNotesTooInductive24] = useState(false);
  const [isNotesTooCritical24, setIsNotesTooCritical24] = useState(false);
  const [isNotesTooSupportive24, setIsNotesTooSupportive24] = useState(false);
  const [isNotesTooFormal25, setIsNotesTooFormal25] = useState(false);
  const [isNotesTooInformal25, setIsNotesTooInformal25] = useState(false);
  const [isNotesTooTechnical25, setIsNotesTooTechnical25] = useState(false);
  const [isNotesTooNonTechnical25, setIsNotesTooNonTechnical25] = useState(false);
  const [isNotesTooVerbose25, setIsNotesTooVerbose25] = useState(false);
  const [isNotesTooConcise25, setIsNotesTooConcise25] = useState(false);
  const [isNotesTooDetailed26, setIsNotesTooDetailed26] = useState(false);
  const [isNotesTooSuperficial26, setIsNotesTooSuperficial26] = useState(false);
  const [isNotesTooComplex26, setIsNotesTooComplex26] = useState(false);
  const [isNotes
