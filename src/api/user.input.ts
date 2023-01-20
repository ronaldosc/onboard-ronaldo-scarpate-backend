import { CreateUserInputModel } from '@domain/model';
import { MinLength, ValidationArguments } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Service } from 'typedi';

/* @ValidatorConstraint({ name: 'CustomMatchPasswords', async: false })
class CustomMatchPasswords implements ValidatorConstraintInterface {
   validate(password: string, args: ValidationArguments) {

      if (password !== (args.object as any)[args.constraints[0]]) return false;
      return true;
   }

   defaultMessage(args: ValidationArguments) {
      return "Passwords do not match!";
   }
}
@ValidatorConstraint({ name: 'CreateUserInput', async: false }) */

@Service()
@InputType()
export class CreateUserInput implements CreateUserInputModel {
  @Field(()=> String)
  name: string = "nome";
  
  @Field(()=> String)
  email!: string;
  
//   @MaxDate(subYears(Date.now(), 15))
  @Field(()=> String)
  birthdate!: string;


//  @Validate(CustomMatchPasswords, ['id'])
  // @Matches(/(?=[[:alpha:]]*?[[:digit:]])(?=[[:digit:]]*?[[:alpha:]])[[:alnum:]]{6,}/gm, { message: 'password too weak' })

   /* @MinLength(6,  {
   message: (args: ValidationArguments) => {
     if (args.value.length === 1) {
       return 'Too short, minimum length is 1 character';
     } else {
       return 'Too short, minimum length is ' + args.constraints[0] + ' characters';
     }
   },
 }) */
  @Field(() => String)
  password!: string;
}
/*  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' }) */


